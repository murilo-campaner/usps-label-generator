# TASKS - USPS Label Generator

## Task Progress

### 1. Project Configuration
- [x] ~~Initialize Next.js project and install EasyPost SDK / dependencies~~ (main task)
- [x] Create or verify Next.js 14 + TS initialization
- [x] Install @easypost/api package and necessary typings
- [x] Configure .env.local with EASYPOST_API_KEY (test)
- [x] Create lib/easypost.ts utility to instantiate EasyPost API using environment variable

### 2. Address Form
- [x] Create form components for from and to addresses (main task)
- [x] Create AddressForm component with street1, street2, city, state, zip fields
- [x] Add dropdown list of states (US) to the form
- [x] Implement required field validation via Zod/Yup
- [x] Incorporate AddressForm in main page

### 3. Address Validation
- [x] Implement address validation via EasyPost API (Address Verification) (main task)
- [x] Create /api/verify-address route for server-side calls
- [x] Within the route, call EasyPost.Address.create with verify:['delivery']
- [x] Return corrections or errors to client and display in form

### 4. Package Form
- [x] Create components for package attributes (weight and dimensions) (main task)
- [x] Add weight, length, width, height fields
- [x] Implement lb→oz conversion and number validation
- [x] Positive limits validation in package form

### 5. Shipment Integration
- [x] Create shipment in EasyPost and buy test label (main task)
- [x] Create /api/create-shipment route
- [x] In the route, create Shipment with addresses and parcel
- [x] Buy test label choosing USPS rate
- [x] Return label URL (pdf/png) to client

### 6. Label Preview
- [x] Display preview of returned label (PDF or PNG) (main task)
- [x] Create LabelPreview component to show label
- [x] Add placeholder/spinner while loading label
- [x] If PDF, embed in iframe; if PNG, show img with zoom

### 7. Download and Print
- [x] Implement download and print buttons for label (main task)
- [x] Implement downloadLabel(url) function to save file
- [x] Implement print button that opens native print window

### 8. UI States
- [x] Handle loading, success and error states in UI (main task)
- [x] Create useAsync hook to manage loading/error/success
- [x] Alert component for error and success messages
- [x] Add spinners to forms and buttons during operations

### 9. README
- [x] Write README with quick instructions, assumptions and next steps (main task)
- [x] Write Quick Start section with installation steps
- [x] Write assumptions and next steps in README

### 10. Tests (Optional)
- [ ] Add unit or e2e tests (optional, time permitting) (main task)
- [ ] Configure Jest and React Testing Library
- [ ] Create mocks/utilities for EasyPost testing
- [ ] Test address verification flow with mock
- [ ] Test shipment creation and label return with mock

## Notes
- **Estimated time**: 4 hours
- **Current status**: ✅ PROJECT COMPLETED
- **Last update**: December 2024

## Project Assumptions
- US addresses only
- Test labels (not real)
- EasyPost API key provided or obtained via free account
- Simple and functional interface (prototype)
