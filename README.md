# USPS Label Generator

A web application for generating and printing USPS shipping labels using the EasyPost API.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- EasyPost account (free for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd usps-label-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env and add your EasyPost API key
   EASYPOST_API_KEY=your_api_key_here
   ```

4. **Run the project**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 How to Use

1. **Fill in addresses**: Enter the from and to addresses (US only)
2. **Validate addresses**: The system will automatically verify address validity
3. **Enter package details**: Add weight and dimensions of the package
4. **Generate label**: The system will create a USPS test label
5. **Download/Print**: View, download, or print the generated label

## 🛠️ Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Static typing
- **Tailwind CSS** - Styling
- **EasyPost API** - Shipping service integration
- **React Hook Form** - Form management
- **Zod** - Data validation

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── verify-address/     # Address validation
│   │   └── create-shipment/    # Label creation
│   ├── page.tsx               # Main page
│   └── layout.tsx
├── components/
│   ├── AddressForm.tsx        # Address form
│   ├── PackageForm.tsx        # Package form
│   ├── LabelPreview.tsx       # Label preview
│   └── Alert.tsx              # Alert component
├── hooks/
│   └── useAsync.ts            # Async operations hook
├── lib/
│   ├── easypost.ts            # EasyPost client
│   └── validations.ts         # Validation schemas
└── types/
    └── address.ts             # TypeScript types
```

## 🔧 Project Assumptions

### During Development
- **US addresses only**: The system accepts only addresses within the United States
- **Test labels**: All generated labels are test labels (not real)
- **API key provided**: Assumes an EasyPost API key is available
- **Simple interface**: Focus on functionality over complex design
- **Basic validation**: Address validation via EasyPost Address Verification
- **Automatic rate selection**: Automatic selection of the cheapest available USPS rate

### Current Limitations
- No international address support
- No user authentication
- No shipment history saving
- No shipping service customization
- Interface in English (could be internationalized)

## 🚀 Next Steps

### Immediate Improvements
- [ ] **Authentication**: Implement login/registration system
- [ ] **History**: Save and display label generation history
- [ ] **Multiple services**: Allow choice between different USPS services
- [ ] **Saved addresses**: Allow saving favorite addresses
- [ ] **Advanced validation**: Improve address error feedback

### Advanced Features
- [ ] **International addresses**: Support for international shipments
- [ ] **Bulk labels**: Generation of multiple labels
- [ ] **E-commerce integration**: Connectors for popular platforms
- [ ] **Reports**: Dashboard with shipping statistics
- [ ] **Webhooks**: Real-time shipment status notifications

### Technical Improvements
- [ ] **Tests**: Add unit and e2e tests
- [ ] **PWA**: Transform into Progressive Web App
- [ ] **Cache**: Implement cache for addresses and rates
- [ ] **Performance**: Loading and rendering optimizations
- [ ] **Accessibility**: Improve screen reader support

## 🔑 EasyPost Configuration

1. Create a free account at [easypost.com](https://www.easypost.com/)
2. Get your API key from the dashboard
3. Use the test key for development
4. For production, use the live key (requires credits)

## 📝 Development Notes

- **Development time**: ~4 hours
- **Status**: Functional prototype
- **Ambiguity**: Project intentionally ambiguous to allow creative interpretations
- **AI Tools**: Developed with AI assistance (Cursor)

## 🤝 Contributing

This is a demonstration project. For contributions:

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is for demonstration purposes and has no specific license.
