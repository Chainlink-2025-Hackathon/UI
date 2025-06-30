# Bitrest UI - Cryptocurrency Trading Platform

A modern, responsive cryptocurrency trading platform built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### Landing Page
- **Modern Hero Section** with compelling call-to-action and platform statistics
- **Feature Showcase** highlighting key platform benefits
- **Live Market Overview** with real-time price data and trading pairs
- **Responsive Design** optimized for all devices

### Trading Dashboard
- **Advanced Trading Interface** with professional-grade tools
- **Interactive Charts** with multiple timeframe options
- **Real-time Order Book** showing live buy/sell orders
- **Order Placement** with market and limit order types
- **Recent Trades** history and execution details

### UI Components
- **Professional Header** with navigation and user actions
- **Market Data Tables** with price changes and volume
- **Trading Forms** with buy/sell functionality
- **Responsive Footer** with comprehensive links

## 🛠 Technology Stack

- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **UI Components**: Custom components with Radix UI integration
- **State Management**: React hooks

## 📦 Project Structure

```
bitrest-ui/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── trading/
│   │   │   └── page.tsx       # Trading dashboard
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Hero.tsx           # Hero section
│   │   ├── Features.tsx       # Features showcase
│   │   ├── MarketOverview.tsx # Market data table
│   │   └── Footer.tsx         # Site footer
│   └── lib/
│       └── utils.ts           # Utility functions
├── public/                    # Static assets
├── package.json
└── README.md
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Blue gradient (blue-600 to purple-600)
- **Success**: Green tones for positive changes
- **Danger**: Red tones for negative changes
- **Neutral**: Gray scale for backgrounds and text

### Typography
- **Headings**: Bold, modern font weights
- **Body**: Clean, readable text with proper spacing
- **Data**: Monospace for numerical values

### Interactive Elements
- **Hover Effects**: Smooth transitions on buttons and cards
- **Focus States**: Clear focus indicators for accessibility
- **Loading States**: Visual feedback for user actions

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bitrest-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📱 Pages and Routes

- **`/`** - Landing page with hero, features, and market overview
- **`/trading`** - Full trading dashboard with charts and order forms
- **Navigation links** for additional pages (to be implemented):
  - `/markets` - Complete market listings
  - `/api` - API documentation
  - `/spot` - Spot trading interface
  - `/futures` - Futures trading interface

## 🎯 Key Components Explained

### Header Component
- Responsive navigation with mobile menu
- User account actions and notifications
- Dropdown menus for product categories

### Hero Section
- Compelling value proposition
- Platform statistics and trust indicators
- Call-to-action buttons for user acquisition

### Trading Interface
- Real-time price charts with SVG graphics
- Order book with live buy/sell data
- Trading forms with market/limit order types
- Recent trades history

### Market Overview
- Sortable table of cryptocurrency prices
- Price change indicators with color coding
- Volume data and trading actions

## 🔧 Customization

### Adding New Trading Pairs
Update the `tradingPairs` array in `/src/app/trading/page.tsx`:

```typescript
const tradingPairs = [
  { symbol: 'NEW/USD', price: 123.45, change: 1.23 },
  // ... existing pairs
]
```

### Modifying Color Scheme
Update Tailwind classes throughout components or customize the theme in `tailwind.config.js`.

### Adding New Features
Create new components in `/src/components/` and import them into the relevant pages.

## 📊 Mock Data

The current implementation uses mock data for demonstration purposes:
- Market prices and changes
- Order book data
- Trading history
- User balances

For production use, integrate with real cryptocurrency APIs such as:
- CoinGecko API
- Binance API
- CoinMarketCap API

## 🚀 Deployment

Build for production:
```bash
npm run build
npm start
```

Deploy to Vercel (recommended):
```bash
npx vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- **Live Demo**: [To be deployed]
- **Documentation**: This README
- **Support**: Create an issue for questions or bugs

---

Built with ❤️ using Next.js and Tailwind CSS
