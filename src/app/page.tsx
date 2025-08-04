'use client';

import { useState } from 'react';
import AddressForm from '@/components/AddressForm';
import PackageForm from '@/components/PackageForm';
import LabelPreview from '@/components/LabelPreview';
import Alert from '@/components/Alert';
import { useAsync } from '@/hooks/useAsync';
import { AddressFormData, PackageData } from '@/lib/validations';
import { API_ENDPOINTS, FORM_STEPS, ALERT_TYPES } from '@/lib/constants';

type Step = 'addresses' | 'package' | 'label';

interface LabelData {
  url: string;
  format: string;
  trackingCode: string;
  rate: {
    service: string;
    rate: number;
    carrier: string;
  };
  trackingUrl?: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>(FORM_STEPS.ADDRESSES);
  const [addressData, setAddressData] = useState<AddressFormData | null>(null);
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [labelData, setLabelData] = useState<LabelData | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);

  // Hook for address validation
  const addressValidation = useAsync(async (...args: unknown[]) => {
    const data = args[0] as AddressFormData;
    const response = await fetch(API_ENDPOINTS.VERIFY_ADDRESS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.fromAddress),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error validating address');
    }

    return response.json();
  });

  // Hook for shipment creation
  const shipmentCreation = useAsync(async (...args: unknown[]) => {
    const data = args[0] as { addresses: AddressFormData; package: PackageData };
    const response = await fetch(API_ENDPOINTS.CREATE_SHIPMENT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromAddress: data.addresses.fromAddress,
        toAddress: data.addresses.toAddress,
        package: data.package,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error creating shipment');
    }

    return response.json();
  });

  const handleAddressSubmit = async (data: AddressFormData) => {
    try {
      // Validate from address first
      const result = await addressValidation.execute(data);

      if (result && result.isValid) {
        setAddressData(data);
        setCurrentStep(FORM_STEPS.PACKAGE);
        setAlert({ type: ALERT_TYPES.SUCCESS, message: 'Addresses validated successfully!' });
      } else {
        const errorMessage = result?.errors?.join(', ') || 'Invalid address. Please check the data and try again.';
        setAlert({ type: ALERT_TYPES.ERROR, message: errorMessage });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error validating addresses.';
      setAlert({ type: ALERT_TYPES.ERROR, message: errorMessage });
    }
  };

  const handlePackageSubmit = async (data: PackageData) => {
    if (!addressData) {
      setAlert({ type: ALERT_TYPES.ERROR, message: 'Address data not found.' });
      return;
    }

    try {
      setPackageData(data);
      const result = await shipmentCreation.execute({ addresses: addressData, package: data });

      if (result && result.success) {
        setLabelData(result.label);
        setCurrentStep(FORM_STEPS.LABEL);
        setAlert({ type: ALERT_TYPES.SUCCESS, message: 'Label generated successfully!' });
      } else {
        const errorMessage = result?.error || 'Failed to generate label.';
        setAlert({ type: ALERT_TYPES.ERROR, message: errorMessage });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error generating label.';
      setAlert({ type: ALERT_TYPES.ERROR, message: errorMessage });
    }
  };

  const handleReset = () => {
    setCurrentStep(FORM_STEPS.ADDRESSES);
    setAddressData(null);
    setPackageData(null);
    setLabelData(null);
    setAlert(null);
    addressValidation.reset();
    shipmentCreation.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            USPS Label Generator
          </h1>
          <p className="text-gray-600">
            Create and print USPS shipping labels quickly and easily
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className={`flex items-center ${currentStep === 'addresses' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'addresses' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                }`}>
                1
              </div>
              <span className="ml-2 font-medium">Addresses</span>
            </div>
            <div className={`w-16 h-0.5 mx-4 ${currentStep === 'package' || currentStep === 'label' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentStep === 'package' ? 'text-blue-600' : currentStep === 'label' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'package' ? 'border-blue-600 bg-blue-600 text-white' :
                currentStep === 'label' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'
                }`}>
                2
              </div>
              <span className="ml-2 font-medium">Package</span>
            </div>
            <div className={`w-16 h-0.5 mx-4 ${currentStep === 'label' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentStep === 'label' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'label' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'
                }`}>
                3
              </div>
              <span className="ml-2 font-medium">Label</span>
            </div>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {currentStep === 'addresses' && (
            <div>
              <AddressForm
                onSubmit={handleAddressSubmit}
                isLoading={addressValidation.loading}
              />
            </div>
          )}

          {currentStep === 'package' && (
            <div>
              <PackageForm
                onSubmit={handlePackageSubmit}
                isLoading={shipmentCreation.loading}
              />
              <button
                onClick={() => setCurrentStep('addresses')}
                className="mt-4 text-blue-600 hover:text-blue-800 underline"
              >
                ← Back to addresses
              </button>
            </div>
          )}

          {currentStep === 'label' && labelData && (
            <div>
              <LabelPreview
                labelUrl={labelData.url}
                format={labelData.format}
                trackingCode={labelData.trackingCode}
                rate={labelData.rate}
                trackingUrl={labelData.trackingUrl}
              />
              <div className="mt-6 text-center">
                <button
                  onClick={handleReset}
                  className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Create New Label
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This is a demonstration project. For production use,
            make sure to configure a valid EasyPost account.
          </p>
        </div>
      </div>
    </div>
  );
}
