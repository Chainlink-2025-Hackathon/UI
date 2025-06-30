// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
  contractCall?: ContractCallObject;
}

export interface ContractCallObject {
  address: string;
  abi: readonly unknown[];
  functionName: string;
  args: readonly unknown[];
  value?: bigint;
}

// Asset Management Types
export interface AssetMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
  animation_url?: string;
  custody_proof?: string;
  appraisal_value?: string;
  authenticity_certificate?: string;
}

export interface CreateAssetMetadataRequest {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
  animation_url?: string;
  custody_proof?: string;
  appraisal_value?: string;
  authenticity_certificate?: string;
}

export interface MintAssetRequest {
  metadataId?: string;
  to: string;
  assetType: string;
  physicalLocation: string;
  appraisalValueUSD: number;
  custodian: string;
  authenticityCertHash: string;
  metadataURI: string;
}

export interface AssetInfo {
  tokenId: string;
  owner: string;
  assetType: string;
  physicalLocation: string;
  appraisalValue: string;
  lastAppraisalDate: string;
  isAuthenticated: boolean;
  custodian: string;
  authenticityCertHash: string;
  isCrossChain: boolean;
  originChain: string;
  metadata: AssetMetadata;
}

export interface AppraisalHistory {
  value: string;
  date: string;
  blockNumber: number;
  transactionHash: string;
}

// Fractionalization Types
export interface FractionalizeAssetRequest {
  tokenId: string;
  fractionalSupply: string;
  reservePrice: string;
}

export interface RedeemAssetRequest {
  fractionalizedTokenContract: string;
  amount: number;
}

export interface FractionalizationInfo {
  assetId: string;
  nftContract: string;
  tokenId: string;
  originalOwner: string;
  fractionalSupply: string;
  reservePrice: string;
  isActive: boolean;
  creationTime: string;
  lastYieldDistribution: string;
  lastReserveCheck: string;
  status: AssetStatus;
  custodianEndpoint: string;
  fractionalTokenContract: string;
}

export interface ReserveData {
  isVerified: boolean;
  lastVerification: string;
  consecutiveFailures: string;
  lastRequestId: string;
}

export interface VerifyTokenRequest {
  fractionalizedTokenContract: string;
}

export interface TokenValueRequest {
  fractionalizedTokenContract: string;
  amount: number;
}

export interface RequestVerificationRequest {
  assetId: string;
}

export interface ChainlinkRequest {
  requestId: string;
  tokenId: string;
  requestType: 'METADATA_UPDATE' | 'AUTHENTICITY_CHECK' | 'RESERVE_VERIFICATION';
  timestamp: string;
  status: 'PENDING' | 'FULFILLED' | 'FAILED';
}

// Lending Types
export interface ProvideLiquidityRequest {
  amount: number;
}

export interface WithdrawLiquidityRequest {
  lpTokenAmount: number;
  tokenAddress: string;
  amount: number;
}

export interface CreateLoanRequest {
  tokenId: string;
  amount: number;
  intrestRate: number;
  duration: number;
}

export interface RepayLoanRequest {
  loanId: number;
  amount: number;
}

export interface LiquidateLoanRequest {
  loanId: number;
}

export interface LoanInfo {
  loanId: string;
  borrower: string;
  lender: string;
  collateralType: 'NFT' | 'FRACTIONAL';
  collateralAddress: string;
  collateralTokenId: string;
  collateralAmount: string;
  loanAmount: string;
  interestRate: string;
  duration: string;
  startTime: string;
  endTime: string;
  status: 'ACTIVE' | 'REPAID' | 'DEFAULTED' | 'LIQUIDATED';
  totalRepayment: string;
  amountRepaid: string;
}

export interface RecommendedLoanAmount {
  recommendedAmount: string;
  maxAmount: string;
  collateralValue: string;
  targetLtv: number;
  maxLtv: number;
  interestRate: string;
}

// Token Operations Types
export interface ApproveTokenRequest {
  tokenAddress: string;
  amount: number;
  spender: string;
}

// Enums
export enum AssetStatus {
  Active = 'Active',
  UnderReview = 'UnderReview',
  Frozen = 'Frozen',
  Liquidating = 'Liquidating'
}

// Response Types for specific endpoints
export interface UserAssetsResponse {
  data: AssetInfo[];
}

export interface AssetOwnerResponse {
  owner: string;
}

export interface AssetBalanceResponse {
  balance: string;
}

export interface ApprovalStatusResponse {
  isApproved: boolean;
}

export interface TokenBalanceResponse {
  balance: string;
}

export interface TokenValueResponse {
  value: string;
}

export interface TotalOwedResponse {
  totalOwed: string;
}

export interface LiquidatableResponse {
  isLiquidatable: boolean;
}

export interface HealthRatioResponse {
  healthRatio: number;
}

export interface UserLoansResponse {
  loanIds: string[];
}

export interface VerifyTokenResponse {
  assetId: string;
  reservePrice: string;
  fractionalSupply: string;
  isActive: boolean;
}

export interface AssetIdResponse {
  assetId: string;
} 