'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { packageSchema, type PackageData } from '@/lib/validations';

interface PackageFormProps {
  onSubmit: (data: PackageData) => void;
  isLoading?: boolean;
}

export default function PackageForm({ onSubmit, isLoading = false }: PackageFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PackageData>({
    resolver: zodResolver(packageSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Package Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (ounces) *
                  </label>
                  <input
                    {...field}
                    type="number"
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="16.0"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                  {errors.weight && (
                    <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    1 pound = 16 ounces
                  </p>
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name="length"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Length (inches) *
                  </label>
                  <input
                    {...field}
                    type="number"
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="8.0"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                  {errors.length && (
                    <p className="text-red-500 text-sm mt-1">{errors.length.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name="width"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width (inches) *
                  </label>
                  <input
                    {...field}
                    type="number"
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="6.0"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                  {errors.width && (
                    <p className="text-red-500 text-sm mt-1">{errors.width.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (inches) *
                  </label>
                  <input
                    {...field}
                    type="number"
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1.0"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                  {errors.height && (
                    <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Make sure the dimensions are accurate.
            Incorrect dimensions may result in inaccurate shipping rates.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Continue'}
      </button>
    </form>
  );
}
