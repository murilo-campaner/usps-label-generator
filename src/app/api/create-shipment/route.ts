import { NextRequest, NextResponse } from 'next/server';
import getEasyPostClient from '@/lib/easypost';
import { shippingFormSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if API key is configured
    if (!process.env.EASYPOST_API_KEY) {
      return NextResponse.json(
        { error: 'EasyPost API key not configured' },
        { status: 500 }
      );
    }

    // Validate input data
    const validationResult = shippingFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid shipping data', details: validationResult.error },
        { status: 400 }
      );
    }

    const { fromAddress, toAddress, package: packageData } = validationResult.data;

    // Get EasyPost client
    const client = getEasyPostClient();

    // Create addresses first
    const fromAddressObj = await client.Address.create({
      street1: fromAddress.street1,
      street2: fromAddress.street2,
      city: fromAddress.city,
      state: fromAddress.state,
      zip: fromAddress.zip,
      country: fromAddress.country || 'US',
    });

    const toAddressObj = await client.Address.create({
      street1: toAddress.street1,
      street2: toAddress.street2,
      city: toAddress.city,
      state: toAddress.state,
      zip: toAddress.zip,
      country: toAddress.country || 'US',
    });

    // Create parcel
    const parcel = await client.Parcel.create({
      weight: packageData.weight,
      length: packageData.length,
      width: packageData.width,
      height: packageData.height,
    });

    // Create shipment with address and parcel objects
    const shipment = await client.Shipment.create({
      from_address: fromAddressObj,
      to_address: toAddressObj,
      parcel: parcel,
    });

    // Find the best USPS rate
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uspsRates = shipment.rates?.filter((rate: any) =>
      rate.carrier.toLowerCase().includes('usps')
    ) || [];

    if (uspsRates.length === 0) {
      return NextResponse.json(
        { error: 'No USPS rates available for this shipment' },
        { status: 400 }
      );
    }

    // Select the cheapest rate (or the first available)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const selectedRate = uspsRates.reduce((cheapest: any, current: any) =>
      current.rate < cheapest.rate ? current : cheapest
    );

    // Buy the label
    const boughtShipment = await client.Shipment.buy(shipment.id, selectedRate);

    // Return label information
    const label = boughtShipment.postage_label;

    return NextResponse.json({
      success: true,
      label: {
        id: label.id,
        url: label.label_url,
        format: label.label_file_type,
        trackingCode: boughtShipment.tracking_code,
        rate: {
          service: selectedRate.service,
          rate: selectedRate.rate,
          carrier: selectedRate.carrier,
        },
      },
      shipment: {
        id: boughtShipment.id,
        trackingUrl: boughtShipment.tracker?.public_url,
      },
    });

  } catch (error) {
    console.error('Error in shipment creation:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Internal server error', message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
