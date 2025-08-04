'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressFormSchema, type AddressFormData } from '@/lib/validations';
import { US_STATES } from '@/types/address';

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  isLoading?: boolean;
}

export default function AddressForm({ onSubmit, isLoading = false }: AddressFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      fromAddress: {
        street1: '350 5th Avenue',
        street2: 'Suite 1000',
        city: 'New York',
        state: 'NY',
        zip: '10118',
        country: 'US',
      },
      toAddress: {
        street1: '1600 Pennsylvania Avenue NW',
        street2: 'Apt 200',
        city: 'Washington',
        state: 'DC',
        zip: '20500',
        country: 'US',
      },
    },
  });

  const handleFormSubmit = (data: AddressFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* From Address */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">From Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Controller
              name="fromAddress.street1"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Main St"
                  />
                  {errors.fromAddress?.street1 && (
                    <p className="text-red-500 text-sm mt-1">{errors.fromAddress.street1.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <Controller
              name="fromAddress.street2"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apartment, suite, etc.
                  </label>
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Apt 4B"
                  />
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name="fromAddress.city"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="New York"
                  />
                  {errors.fromAddress?.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.fromAddress.city.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name="fromAddress.state"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a state</option>
                    {US_STATES.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                  {errors.fromAddress?.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.fromAddress.state.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name="fromAddress.zip"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12345"
                  />
                  {errors.fromAddress?.zip && (
                    <p className="text-red-500 text-sm mt-1">{errors.fromAddress.zip.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* To Address */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">To Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Controller
              name="toAddress.street1"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="456 Oak Ave"
                  />
                  {errors.toAddress?.street1 && (
                    <p className="text-red-500 text-sm mt-1">{errors.toAddress.street1.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <Controller
              name="toAddress.street2"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apartment, suite, etc.
                  </label>
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Suite 100"
                  />
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name="toAddress.city"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Los Angeles"
                  />
                  {errors.toAddress?.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.toAddress.city.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name="toAddress.state"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a state</option>
                    {US_STATES.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                  {errors.toAddress?.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.toAddress.state.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name="toAddress.zip"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="90210"
                  />
                  {errors.toAddress?.zip && (
                    <p className="text-red-500 text-sm mt-1">{errors.toAddress.zip.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Validating...' : 'Validate Addresses'}
      </button>
    </form>
  );
}
