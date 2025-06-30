export type AssetType = 'art' | 'commodity' | 'real-estate';

export type AssetStatus = 'minting' | 'minted' | 'fractionalized' | 'collateralized' | 'auctioned';

export interface BaseAsset {
  id: string;
  tokenId?: string;
  title: string;
  description: string;
  assetType: AssetType;
  status: AssetStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AssetMetadata {
  // IPFS and basic metadata
  ipfsHash: string;
  imageUrls: string[];
  documentUrls: string[];
  
  // Physical asset details
  location: string;
  custodian: string;
  authenticityCertificate: string;
  
  // Valuation
  appraisalValue: string;
  appraisalDate: string;
  appraiser: string;
  currency: string;
  
  // Chainlink integration
  chainlinkJobId?: string;
  lastVerification?: string;
  proofOfReserveStatus: 'verified' | 'pending' | 'failed';
  
  // Additional metadata
  attributes: Record<string, string>;
  tags: string[];
}

export interface TokenizedAsset extends BaseAsset {
  // Blockchain data
  contractAddress: string;
  tokenId: string;
  owner: string;
  network: string;
  
  // Asset metadata
  metadata: AssetMetadata;
  
  // Market data
  currentValue: string;
  floorPrice: string;
  lastSalePrice?: string;
  
  // Fractionalization
  isFractionalized: boolean;
  fractionContract?: string;
  totalFractions?: number;
  availableFractions?: number;
  
  // Lending
  isCollateralized: boolean;
  loanContract?: string;
  
  // Auction
  isAuctioned: boolean;
  auctionContract?: string;
}

export interface AssetFraction {
  id: string;
  parentAssetId: string;
  tokenAddress: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  pricePerToken: string;
  
  // Trading
  volume24h: string;
  volumeTotal: string;
  holders: number;
  
  // Yield
  dividendYield?: string;
  lastDividendDate?: string;
  totalDividends?: string;
}

export interface AssetVerification {
  id: string;
  assetId: string;
  verificationType: 'authenticity' | 'custody' | 'valuation';
  status: 'pending' | 'verified' | 'failed';
  
  // Chainlink data
  chainlinkJobId: string;
  chainlinkRequestId?: string;
  chainlinkResponse?: any;
  
  // Verification details
  verificationDate: string;
  verifiedBy: string;
  evidence: string[];
  notes?: string;
}

export interface AssetHistory {
  id: string;
  assetId: string;
  action: 'minted' | 'fractionalized' | 'transferred' | 'collateralized' | 'liquidated';
  timestamp: string;
  transactionHash: string;
  from?: string;
  to?: string;
  value?: string;
  details: Record<string, any>;
}

// Asset creation interfaces
export interface CreateAssetRequest {
  title: string;
  description: string;
  assetType: AssetType;
  location: string;
  custodian: string;
  appraisalValue: string;
  appraisalDate: string;
  appraiser: string;
  
  // Files
  images: File[];
  documents: File[];
  authenticityCertificate: File;
  
  // Additional metadata
  attributes: Record<string, string>;
  tags: string[];
}

export interface MintAssetRequest extends CreateAssetRequest {
  network: string;
  recipientAddress: string;
}

// Asset search and filtering
export interface AssetFilters {
  assetTypes?: AssetType[];
  status?: AssetStatus[];
  priceRange?: {
    min: string;
    max: string;
  };
  location?: string;
  custodian?: string;
  isFractionalized?: boolean;
  isCollateralized?: boolean;
  sortBy?: 'price' | 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface AssetSearchResult {
  assets: TokenizedAsset[];
  total: number;
  hasMore: boolean;
} 