// API Configuration
export const API_ENDPOINTS = {
  VERIFY_ADDRESS: '/api/verify-address',
  CREATE_SHIPMENT: '/api/create-shipment',
} as const;

// Form Steps
export const FORM_STEPS = {
  ADDRESSES: 'addresses',
  PACKAGE: 'package',
  LABEL: 'label',
} as const;

// Alert Types
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Timeouts
export const TIMEOUTS = {
  IMAGE_LOAD: 3000, // 3 seconds
  SUCCESS_MESSAGE: 3000, // 3 seconds
  PRINT_FALLBACK: 2000, // 2 seconds
} as const;

// Package Limits
export const PACKAGE_LIMITS = {
  MAX_WEIGHT: 1000, // ounces
  MAX_DIMENSION: 200, // inches
} as const;

// File Formats
export const FILE_FORMATS = {
  PNG: 'image/png',
  PDF: 'application/pdf',
} as const;
