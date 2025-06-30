# Bagel NFT DeFi API Service

A comprehensive TypeScript/JavaScript client for the Bagel NFT DeFi platform API, providing easy access to asset tokenization, fractionalization, lending, and governance features.

## 📚 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Service Usage](#api-service-usage)
- [React Hooks Usage](#react-hooks-usage)
- [Available Endpoints](#available-endpoints)
- [Error Handling](#error-handling)
- [Type Safety](#type-safety)
- [Examples](#examples)

## 🚀 Installation

The API service is already included in the project with all necessary dependencies:

```bash
npm install axios @tanstack/react-query
```

## 🔧 Quick Start

### Direct API Usage

```typescript
import { apiClient, BagelNFTDeFiAPI } from '../lib/api';

// Use the default client
const healthStatus = await apiClient.healthCheck();

// Or create a custom instance
const customAPI = new BagelNFTDeFiAPI('https://api.yourserver.com/api');
```

### React Hooks Usage

```typescript
import { useUserAssets, useMintAsset } from '../hooks/useApi';
import { useAccount } from 'wagmi';

function MyComponent() {
  const { address } = useAccount();
  const { data: assets, isLoading } = useUserAssets(address);
  const mintAsset = useMintAsset();

  const handleMint = () => {
    mintAsset.mutate({
      to: address!,
      assetType: 'artwork',
      physicalLocation: 'Secure Storage Facility',
      appraisalValueUSD: 100000,
      custodian: 'Art Storage Inc',
      authenticityCertHash: '0xabc123...',
      metadataURI: 'ipfs://QmMetadata...'
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Your Assets: {assets?.data?.length || 0}</h2>
      <button onClick={handleMint}>Mint New Asset</button>
    </div>
  );
}
```

## 🏗️ API Service Usage

### Configuration

```typescript
import { BagelNFTDeFiAPI } from '../lib/api';

const api = new BagelNFTDeFiAPI('http://localhost:3000/api');

// Configure custom settings
api.setTimeout(60000); // 60 seconds
api.setHeaders({ 'X-API-Key': 'your-api-key' });
api.setAuthToken('your-jwt-token');
```

### Asset Management

```typescript
// Create asset metadata
const metadata = await api.createAssetMetadata({
  name: 'Premium Artwork',
  description: 'Original painting by renowned artist',
  image: 'ipfs://QmImageHash',
  attributes: [
    { trait_type: 'Artist', value: 'John Doe' },
    { trait_type: 'Year', value: 2023 }
  ]
});

// Mint asset NFT
const mintResult = await api.mintAsset({
  to: '0x742d35Cc6634C0532925a3b8D82C57B3e7B3aaB5',
  assetType: 'artwork',
  physicalLocation: 'Secure Art Storage',
  appraisalValueUSD: 150000,
  custodian: 'SecureArt Storage',
  authenticityCertHash: '0xabc123...',
  metadataURI: 'ipfs://QmMetadata...'
});

// Get user's assets
const userAssets = await api.getUserAssets('0x742d35...');

// Get asset information
const assetInfo = await api.getAssetInfo('1');
```

### Fractionalization

```typescript
// Approve asset for fractionalization
await api.approveAssetForFractionalization('1');

// Fractionalize asset
const fractionResult = await api.fractionalizeAsset({
  tokenId: '1',
  fractionalSupply: '1000000',
  reservePrice: '100'
});

// Get fractionalized asset info
const fractionalInfo = await api.getFractionalizedAsset(fractionResult.data?.assetId!);

// Request reserve verification
await api.requestReserveVerification({
  assetId: fractionResult.data?.assetId!
});
```

### Lending

```typescript
// Approve asset for lending
await api.approveAssetForLending('1');

// Get recommended loan amount
const recommendation = await api.getRecommendedLoanAmount('1', '0xTokenAddress');

// Create loan
const loanResult = await api.createLoan({
  assetNftContract: '0xAssetContract',
  tokenId: '1',
  loanTokenAddress: '0xLoanToken',
  amount: 50000,
  intrestRate: 500, // 5%
  duration: 2592000 // 30 days
});

// Get loan information
const loanInfo = await api.getLoanInfo(loanResult.data?.loanId!);

// Repay loan
await api.repayLoan({
  loanId: parseInt(loanResult.data?.loanId!),
  amount: 52500
});
```

## 🎣 React Hooks Usage

### Asset Management Hooks

```typescript
import {
  useUserAssets,
  useAssetInfo,
  useMintAsset,
  useAppraisalHistory
} from '../hooks/useApi';

function AssetDashboard() {
  const { address } = useAccount();
  
  // Get user's assets
  const { data: assets, isLoading, error } = useUserAssets(address);
  
  // Get specific asset info
  const { data: assetInfo } = useAssetInfo('1');
  
  // Mint asset mutation
  const mintAsset = useMintAsset();
  
  // Get appraisal history
  const { data: history } = useAppraisalHistory('1');

  const handleMint = () => {
    mintAsset.mutate({
      to: address!,
      assetType: 'real-estate',
      physicalLocation: '123 Main St',
      appraisalValueUSD: 500000,
      custodian: 'Real Estate Custodian',
      authenticityCertHash: '0xdef456...',
      metadataURI: 'ipfs://QmRealEstate...'
    });
  };

  return (
    <div>
      <h2>Assets: {assets?.data?.length || 0}</h2>
      <button 
        onClick={handleMint} 
        disabled={mintAsset.isLoading}
      >
        {mintAsset.isLoading ? 'Minting...' : 'Mint Asset'}
      </button>
    </div>
  );
}
```

### Fractionalization Hooks

```typescript
import {
  useFractionalizeAsset,
  useFractionalizedAsset,
  useReserveData,
  useRequestReserveVerification
} from '../hooks/useApi';

function FractionalizationPanel({ tokenId }: { tokenId: string }) {
  const fractionalizeAsset = useFractionalizeAsset();
  const requestVerification = useRequestReserveVerification();
  
  const handleFractionalize = () => {
    fractionalizeAsset.mutate({
      tokenId,
      fractionalSupply: '1000000',
      reservePrice: '100'
    });
  };

  const handleVerifyReserves = (assetId: string) => {
    requestVerification.mutate({ assetId });
  };

  return (
    <div>
      <button onClick={handleFractionalize}>
        Fractionalize Asset
      </button>
    </div>
  );
}
```

### Lending Hooks

```typescript
import {
  useCreateLoan,
  useLoanInfo,
  useUserLoans,
  useRecommendedLoanAmount
} from '../hooks/useApi';

function LendingPanel({ tokenId }: { tokenId: string }) {
  const { address } = useAccount();
  const createLoan = useCreateLoan();
  const { data: userLoans } = useUserLoans(address);
  const { data: recommendation } = useRecommendedLoanAmount(
    tokenId, 
    '0xLoanTokenAddress'
  );

  const handleCreateLoan = () => {
    createLoan.mutate({
      assetNftContract: '0xAssetContract',
      tokenId,
      loanTokenAddress: '0xLoanToken',
      amount: 50000,
      intrestRate: 500,
      duration: 2592000
    });
  };

  return (
    <div>
      <p>Recommended Amount: {recommendation?.data?.recommendedAmount}</p>
      <p>Your Loans: {userLoans?.data?.loanIds.length || 0}</p>
      <button onClick={handleCreateLoan}>Create Loan</button>
    </div>
  );
}
```

## 📋 Available Endpoints

### System Endpoints (1)
- `GET /health` - Health check

### Asset Management (7 endpoints)
- `POST /assets/metadata` - Create asset metadata
- `POST /assets/mint` - Mint asset NFT
- `GET /assets/user/:userAddress` - Get user's assets
- `GET /assets/:tokenId/info` - Get asset information
- `GET /assets/:tokenId/owner` - Get asset owner
- `GET /assets/balance/:userAddress` - Get asset balance
- `GET /assets/:tokenId/appraisal-history` - Get appraisal history

### Fractionalization (12 endpoints)
- `POST /fractionalization/approve` - Approve for fractionalization
- `POST /fractionalization/fractionalize` - Fractionalize asset
- `POST /fractionalization/redeem` - Redeem fractional tokens
- `GET /fractionalization/approval-status/:tokenId` - Check approval
- `GET /fractionalization/asset/:assetId` - Get fractionalized asset
- `GET /fractionalization/reserve/:assetId` - Get reserve data
- `GET /fractionalization/token-info/:tokenContract` - Get asset ID from token
- `GET /fractionalization/balance/:assetId/:userAddress` - Get token balance
- `POST /fractionalization/verify-token` - Verify fractional token
- `POST /fractionalization/token-value` - Get token value
- `POST /fractionalization/request-verification` - Request reserve verification
- `GET /fractionalization/verification-status/:assetId` - Get verification status

### Lending (15 endpoints)
- `POST /lending/provide-liquidity` - Provide liquidity
- `POST /lending/withdraw-liquidity` - Withdraw liquidity
- `POST /lending/approve-asset` - Approve NFT for lending
- `GET /lending/approval-status/:tokenId` - Check lending approval
- `GET /lending/recommended-amount/:tokenId/:loanTokenAddress` - Get loan recommendation
- `POST /lending/create-loan` - Create NFT loan
- `POST /lending/repay-loan` - Repay loan
- `POST /lending/liquidate-loan` - Liquidate loan
- `GET /lending/loan/:loanId` - Get loan details
- `GET /lending/total-owed/:loanId` - Calculate total owed
- `GET /lending/liquidatable/:loanId` - Check if liquidatable
- `GET /lending/health-ratio/:loanId` - Get health ratio
- `GET /lending/user-loans/:userAddress` - Get user's loans
- `GET /lending/active-loans` - Get all active loans
- `GET /lending/liquidatable-loans` - Get liquidatable loans

### Token Operations (1 endpoint)
- `POST /tokens/approve` - Approve ERC-20 token

## 🚨 Error Handling

### API Service Error Handling

```typescript
import { apiClient } from '../lib/api';

try {
  const result = await apiClient.mintAsset({
    // ... mint parameters
  });
  
  if (result.success) {
    console.log('Asset minted:', result.data);
  } else {
    console.error('Mint failed:', result.message);
  }
} catch (error) {
  console.error('API Error:', error);
  // Handle network errors, timeouts, etc.
}
```

### React Hook Error Handling

```typescript
import { useMintAsset } from '../hooks/useApi';

function MintComponent() {
  const mintAsset = useMintAsset();

  const handleMint = () => {
    mintAsset.mutate(
      { /* mint parameters */ },
      {
        onSuccess: (data) => {
          console.log('Mint successful:', data);
        },
        onError: (error) => {
          console.error('Mint failed:', error);
        }
      }
    );
  };

  return (
    <div>
      {mintAsset.error && (
        <div className="error">
          Error: {mintAsset.error.message}
        </div>
      )}
      <button onClick={handleMint} disabled={mintAsset.isLoading}>
        Mint Asset
      </button>
    </div>
  );
}
```

## 🔒 Type Safety

All API methods are fully typed with TypeScript:

```typescript
// Request types are enforced
const mintRequest: MintAssetRequest = {
  to: '0x742d35Cc6634C0532925a3b8D82C57B3e7B3aaB5',
  assetType: 'artwork', // Type: string
  physicalLocation: 'Storage', // Type: string
  appraisalValueUSD: 100000, // Type: number
  custodian: 'Custodian Inc', // Type: string
  authenticityCertHash: '0xhash', // Type: string
  metadataURI: 'ipfs://metadata' // Type: string
};

// Response types are typed
const response: ApiResponse<{ tokenId: string; txHash: string }> = 
  await apiClient.mintAsset(mintRequest);

// Data is properly typed
if (response.success && response.data) {
  const tokenId: string = response.data.tokenId;
  const txHash: string = response.data.txHash;
}
```

## 📝 Configuration Options

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_API_TIMEOUT=30000
```

### Custom Configuration

```typescript
import { BagelNFTDeFiAPI } from '../lib/api';

const api = new BagelNFTDeFiAPI(
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'
);

// Configure timeouts
api.setTimeout(60000);

// Add custom headers
api.setHeaders({
  'X-API-Version': '1.0.0',
  'X-Client-Type': 'web'
});

// Set authentication
api.setAuthToken('your-jwt-token');
```

## 🔄 Query Invalidation

```typescript
import { useInvalidateQueries } from '../hooks/useApi';

function ManagementPanel() {
  const invalidate = useInvalidateQueries();

  const handleRefresh = () => {
    // Invalidate specific queries
    invalidate.invalidateUserAssets('0xUserAddress');
    invalidate.invalidateAssetInfo('1');
    
    // Or invalidate everything
    invalidate.invalidateAll();
  };

  return <button onClick={handleRefresh}>Refresh Data</button>;
}
```

## 🎯 Best Practices

### 1. Use React Hooks for UI Components

```typescript
// ✅ Good: Use hooks in React components
function AssetList() {
  const { address } = useAccount();
  const { data: assets } = useUserAssets(address);
  return <div>{/* Render assets */}</div>;
}

// ❌ Avoid: Direct API calls in components
function AssetList() {
  const [assets, setAssets] = useState([]);
  useEffect(() => {
    apiClient.getUserAssets(address).then(setAssets);
  }, [address]);
  return <div>{/* Render assets */}</div>;
}
```

### 2. Handle Loading and Error States

```typescript
function AssetInfo({ tokenId }: { tokenId: string }) {
  const { data, isLoading, error } = useAssetInfo(tokenId);

  if (isLoading) return <div>Loading asset...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.success) return <div>Asset not found</div>;

  return <div>{/* Render asset info */}</div>;
}
```

### 3. Use Proper Query Keys

```typescript
// Query keys are automatically managed by hooks
const { data } = useAssetInfo(tokenId); // queryKey: ['assetInfo', tokenId]
const { data } = useUserAssets(address); // queryKey: ['userAssets', address]
```

### 4. Optimize with Stale Time

```typescript
// Hooks already have optimized stale times
// Asset info: 1 minute
// User assets: 30 seconds  
// Active loans: 2 minutes with auto-refresh
```

## 🔧 Troubleshooting

### Common Issues

1. **Network Errors**: Check API base URL and network connectivity
2. **Type Errors**: Ensure all required fields are provided
3. **Authentication**: Set proper auth tokens if required
4. **CORS Issues**: Configure CORS on the API server

### Debug Mode

```typescript
// Enable request/response logging
const api = new BagelNFTDeFiAPI('http://localhost:3000/api');

// Logging is automatically enabled in the constructor
// Check browser console for API request logs
```

---

**Version**: 1.0.0  
**Last Updated**: 2025-01-11  
**License**: MIT 