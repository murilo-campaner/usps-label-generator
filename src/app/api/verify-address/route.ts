import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/easypost';
import { addressSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    const validationResult = addressSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid address data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const addressData = validationResult.data;

    // Create address in EasyPost with verification
    const address = await client.Address.create({
      street1: addressData.street1,
      street2: addressData.street2,
      city: addressData.city,
      state: addressData.state,
      zip: addressData.zip,
      country: addressData.country || 'US',
      verify: ['delivery'],
    });

    // Check if address was verified successfully
    if (address.verifications?.delivery?.success) {
      return NextResponse.json({
        isValid: true,
        address: {
          street1: address.street1,
          street2: address.street2,
          city: address.city,
          state: address.state,
          zip: address.zip,
          country: address.country,
        },
        corrections: null,
      });
    } else {
      // Invalid address
      const errors = address.verifications?.delivery?.errors?.map(err => err.message) || [];
      return NextResponse.json({
        isValid: false,
        errors: errors.length > 0 ? errors : ['Address could not be verified'],
        suggestions: null,
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in address verification:', error);

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
