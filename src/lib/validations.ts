import { z } from 'zod';

// Schema for individual address
export const addressSchema = z.object({
  street1: z.string().min(1, 'Street address is required'),
  street2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be in valid format (12345 or 12345-6789)').min(5, 'ZIP code is required'),
  country: z.string(),
});

// Schema for complete address form
export const addressFormSchema = z.object({
  fromAddress: addressSchema,
  toAddress: addressSchema,
});

// Schema for package
export const packageSchema = z.object({
  weight: z.number().positive('Weight must be positive').max(1000, 'Weight cannot exceed 1000 ounces'),
  length: z.number().positive('Length must be positive').max(200, 'Length cannot exceed 200 inches'),
  width: z.number().positive('Width must be positive').max(200, 'Width cannot exceed 200 inches'),
  height: z.number().positive('Height must be positive').max(200, 'Height cannot exceed 200 inches'),
});

// Schema for complete form
export const shippingFormSchema = z.object({
  fromAddress: addressSchema,
  toAddress: addressSchema,
  package: packageSchema,
});

export type AddressFormData = z.infer<typeof addressFormSchema>;
export type PackageData = z.infer<typeof packageSchema>;
export type ShippingFormData = z.infer<typeof shippingFormSchema>;
