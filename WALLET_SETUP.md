# Wallet Setup Guide

## Overview
This application uses Wagmi v2 for wallet connectivity, supporting multiple wallet types including MetaMask, WalletConnect, injected wallets, and Safe wallets.

## ⚠️ Quick Fix for WalletConnect Error

If you're seeing this error:
```
Fatal socket error: WebSocket connection closed abnormally with code: 3000 (Unauthorized: invalid key)
```

**IMMEDIATE SOLUTION**: The WalletConnect connector has been temporarily disabled until you set up a valid project ID. Other wallets (MetaMask, injected wallets, Safe) will work normally.

## Setup Instructions

### 1. WalletConnect Project ID Setup (Optional)

To enable WalletConnect functionality, you need to obtain a project ID:

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up for a free account
3. Create a new project
4. Copy your Project ID
5. Create a `.env.local` file in your project root:

```bash
# .env.local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-actual-project-id-here
```

6. Restart your development server

**Note**: WalletConnect is now conditionally loaded - it will only be available if you provide a valid project ID.

### 2. Supported Wallets

The application currently supports these wallet connectors:

- **✅ Injected Wallets**: Browser extension wallets (MetaMask, etc.) - **WORKING**
- **✅ MetaMask**: Dedicated MetaMask connector - **WORKING** 
- **⚠️ WalletConnect**: Mobile and desktop wallets - **REQUIRES PROJECT ID**
- **✅ Safe**: Gnosis Safe multisig wallets - **WORKING**

### 3. Testing Without WalletConnect

You can test the wallet functionality immediately using:
1. **MetaMask**: Install the browser extension
2. **Other Injected Wallets**: Any browser extension wallet
3. **Safe**: Gnosis Safe wallets

### 4. Supported Networks

Currently configured networks:
- Ethereum Mainnet
- Sepolia Testnet
- Polygon
- Arbitrum
- Base

### 5. Features

- **Wallet Connection**: Connect to multiple wallet types
- **Account Display**: Show connected address, ENS name, and avatar
- **Network Display**: Show current network information
- **Balance Display**: Show ETH balance
- **Disconnect**: Disconnect wallet functionality
- **Connection Status**: Real-time connection status updates

### 6. Usage

The wallet functionality is available through:

- **WalletButton**: Main wallet connect/disconnect button in the header
- **WalletConnectModal**: Modal for wallet selection and account management
- **useWallet Hook**: Custom hook for wallet state management

### 7. Styling

The wallet components use the existing design system with:
- Consistent theming (light/dark mode support)
- Responsive design
- Hover and focus states
- Loading states
- Error handling

### 8. Testing

To test the wallet functionality:

1. Ensure you have a wallet installed (MetaMask recommended)
2. Click the "Connect Wallet" button
3. Select your preferred wallet from the modal
4. Follow the wallet's connection prompts
5. Once connected, you should see your address/ENS name in the button

## Troubleshooting

### Common Issues

1. **✅ FIXED: WalletConnect WebSocket Error**: WalletConnect is now conditionally loaded
2. **MetaMask not detected**: Ensure MetaMask is installed and enabled  
3. **Connection failing**: Check network connectivity and wallet permissions
4. **ENS not resolving**: ENS resolution requires mainnet connection

### Error Messages

- **"Fatal socket error: WebSocket connection closed abnormally with code: 3000"**: 
  - ✅ **FIXED**: WalletConnect now requires valid project ID
  - **Solution**: Set up WalletConnect project ID or use other wallet connectors

### Support

For additional help, refer to:
- [Wagmi Documentation](https://wagmi.sh/)
- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [Viem Documentation](https://viem.sh/) 