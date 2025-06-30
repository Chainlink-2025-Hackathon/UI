import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ApiResponse,
  AssetMetadata,
  CreateAssetMetadataRequest,
  MintAssetRequest,
  AssetInfo,
  AppraisalHistory,
  FractionalizeAssetRequest,
  RedeemAssetRequest,
  FractionalizationInfo,
  ReserveData,
  VerifyTokenRequest,
  TokenValueRequest,
  RequestVerificationRequest,
  ChainlinkRequest,
  ProvideLiquidityRequest,
  WithdrawLiquidityRequest,
  CreateLoanRequest,
  RepayLoanRequest,
  LiquidateLoanRequest,
  LoanInfo,
  RecommendedLoanAmount,
  ApproveTokenRequest,
  //UserAssetsResponse,
  AssetOwnerResponse,
  AssetBalanceResponse,
  ApprovalStatusResponse,
  TokenBalanceResponse,
  TokenValueResponse,
  TotalOwedResponse,
  LiquidatableResponse,
  HealthRatioResponse,
  UserLoansResponse,
  VerifyTokenResponse,
  AssetIdResponse,
} from '../types/api';

export class BagelNFTDeFiAPI {
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:3001/api') {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Utility method to handle API responses
  private async handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): Promise<ApiResponse<T>> {
    return response.data;
  }

  // =====================
  // SYSTEM ENDPOINTS
  // =====================

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<ApiResponse> {
    const response = await this.axiosInstance.get('/health');
    return this.handleResponse(response);
  }

  // =====================
  // ASSET MANAGEMENT API
  // =====================

  /**
   * Create asset metadata
   */
  async createAssetMetadata(data: CreateAssetMetadataRequest): Promise<ApiResponse<AssetMetadata>> {
    const response = await this.axiosInstance.post('/assets/metadata', data);
    return this.handleResponse(response);
  }

  /**
   * Mint asset NFT
   */
  async mintAsset(data: MintAssetRequest): Promise<ApiResponse<{ tokenId: string; txHash: string }>> {
    const response = await this.axiosInstance.post('/assets/mint', data);
    return this.handleResponse(response);
  }

  /**
   * Get user's assets
   */
  async getUserAssets(userAddress: string): Promise<ApiResponse<string[]>> {
    const response = await this.axiosInstance.get(`/assets/user/${userAddress}`);
    return this.handleResponse(response);
  }

  /**
   * Get asset information
   */
  async getAssetInfo(tokenId: string): Promise<ApiResponse<AssetInfo>> {
    const response = await this.axiosInstance.get(`/assets/${tokenId}/info`);
    return this.handleResponse(response);
  }

  /**
   * Get asset owner
   */
  async getAssetOwner(tokenId: string): Promise<ApiResponse<AssetOwnerResponse>> {
    const response = await this.axiosInstance.get(`/assets/${tokenId}/owner`);
    return this.handleResponse(response);
  }

  /**
   * Get asset balance for user
   */
  async getAssetBalance(userAddress: string): Promise<ApiResponse<AssetBalanceResponse>> {
    const response = await this.axiosInstance.get(`/assets/balance/${userAddress}`);
    return this.handleResponse(response);
  }

  /**
   * Get appraisal history
   */
  async getAppraisalHistory(tokenId: string): Promise<ApiResponse<AppraisalHistory[]>> {
    const response = await this.axiosInstance.get(`/assets/${tokenId}/appraisal-history`);
    return this.handleResponse(response);
  }

  // =====================
  // FRACTIONALIZATION API
  // =====================

  /**
   * Approve asset for fractionalization
   */
  async approveAssetForFractionalization(tokenId: string): Promise<ApiResponse<{ txHash: string }>> {
    const response = await this.axiosInstance.post('/fractionalization/approve', { tokenId });
    return this.handleResponse(response);
  }

  /**
   * Fractionalize asset
   */
  async fractionalizeAsset(data: FractionalizeAssetRequest): Promise<ApiResponse<{ assetId: string; txHash: string }>> {
    const response = await this.axiosInstance.post('/fractionalization/fractionalize', data);
    return this.handleResponse(response);
  }

  /**
   * Redeem fractionalized asset
   */
  async redeemAsset(data: RedeemAssetRequest): Promise<ApiResponse<{ txHash: string }>> {
    const response = await this.axiosInstance.post('/fractionalization/redeem', data);
    return this.handleResponse(response);
  }

  /**
   * Check fractionalization approval status
   */
  async getFractionalizationApprovalStatus(tokenId: string): Promise<ApiResponse<ApprovalStatusResponse>> {
    const response = await this.axiosInstance.get(`/fractionalization/approval-status/${tokenId}`);
    return this.handleResponse(response);
  }

  /**
   * Get fractionalized asset information
   */
  async getFractionalizedAsset(assetId: string): Promise<ApiResponse<FractionalizationInfo>> {
    const response = await this.axiosInstance.get(`/fractionalization/asset/${assetId}`);
    return this.handleResponse(response);
  }

  /**
   * Get reserve data
   */
  async getReserveData(assetId: string): Promise<ApiResponse<ReserveData>> {
    const response = await this.axiosInstance.get(`/fractionalization/reserve/${assetId}`);
    return this.handleResponse(response);
  }

  /**
   * Get fractionalized asset info by token contract
   */
  async getFractionalizedAssetInfo(tokenContract: string): Promise<ApiResponse<AssetIdResponse>> {
    const response = await this.axiosInstance.get(`/fractionalization/token-info/${tokenContract}`);
    return this.handleResponse(response);
  }

  /**
   * Get asset token balance
   */
  async getAssetTokenBalance(assetId: string, userAddress: string): Promise<ApiResponse<TokenBalanceResponse>> {
    const response = await this.axiosInstance.get(`/fractionalization/balance/${assetId}/${userAddress}`);
    return this.handleResponse(response);
  }

  /**
   * Verify fractionalized token
   */
  async verifyFractionalizedToken(data: VerifyTokenRequest): Promise<ApiResponse<VerifyTokenResponse>> {
    const response = await this.axiosInstance.post('/fractionalization/verify-token', data);
    return this.handleResponse(response);
  }

  /**
   * Get token value
   */
  async getTokenValue(data: TokenValueRequest): Promise<ApiResponse<TokenValueResponse>> {
    const response = await this.axiosInstance.post('/fractionalization/token-value', data);
    return this.handleResponse(response);
  }

  /**
   * Request reserve verification (Chainlink Functions)
   */
  async requestReserveVerification(data: RequestVerificationRequest): Promise<ApiResponse<{ txHash: string }>> {
    const response = await this.axiosInstance.post('/fractionalization/request-verification', data);
    return this.handleResponse(response);
  }

  /**
   * Get reserve verification status
   */
  async getReserveVerificationStatus(assetId: string): Promise<ApiResponse<ChainlinkRequest[]>> {
    const response = await this.axiosInstance.get(`/fractionalization/verification-status/${assetId}`);
    return this.handleResponse(response);
  }

  // =====================
  // LENDING API
  // =====================

  /**
   * Provide liquidity
   * 
   * 
   */

  async approveTokenForLending (amount: number): Promise<ApiResponse<{ txHash: string }>> {
    const response = await this.axiosInstance.post('/lending/approve-token-for-lending', { amount });
    return this.handleResponse(response);
  }

  async provideLiquidity(data: ProvideLiquidityRequest): Promise<ApiResponse<{ txHash: string; lpToken: string }>> {
    const response = await this.axiosInstance.post('/lending/provide-liquidity', data);
    return this.handleResponse(response);
  }

  /**
   * Withdraw liquidity
   */
  async withdrawLiquidity(data: WithdrawLiquidityRequest): Promise<ApiResponse<{ txHash: string }>> {
    const response = await this.axiosInstance.post('/lending/withdraw-liquidity', data);
    return this.handleResponse(response);
  }

  /**
   * Approve asset for lending
   */
  async approveAssetForLending(tokenId: string): Promise<ApiResponse<{ txHash: string }>> {
    const response = await this.axiosInstance.post('/lending/approve-asset', { tokenId });
    return this.handleResponse(response);
  }

  /**
   * Check lending approval status
   */
  async getLendingApprovalStatus(tokenId: string): Promise<ApiResponse<ApprovalStatusResponse>> {
    const response = await this.axiosInstance.get(`/lending/approval-status/${tokenId}`);
    return this.handleResponse(response);
  }

  /**
   * Get recommended loan amount
   */
  async getRecommendedLoanAmount(tokenId: string, loanTokenAddress: string): Promise<ApiResponse<RecommendedLoanAmount>> {
    const response = await this.axiosInstance.get(`/lending/recommended-amount/${tokenId}/${loanTokenAddress}`);
    return this.handleResponse(response);
  }

  /**
   * Create NFT loan
   */
  async createLoan(data: CreateLoanRequest): Promise<ApiResponse<{ loanId: string; txHash: string }>> {
    console.log('Creating loan with data:', data);
    
    const response = await this.axiosInstance.post('/lending/create-loan', data);
    return this.handleResponse(response);
  }

  /**
   * Repay loan
   */
  async repayLoan(data: RepayLoanRequest): Promise<ApiResponse<{ txHash: string }>> {
    const response = await this.axiosInstance.post('/lending/repay-loan', data);
    return this.handleResponse(response);
  }

  /**
   * Liquidate loan
   */
  async liquidateLoan(data: LiquidateLoanRequest): Promise<ApiResponse<{ txHash: string }>> {
    const response = await this.axiosInstance.post('/lending/liquidate-loan', data);
    return this.handleResponse(response);
  }

  /**
   * Get loan information
   */
  async getLoanInfo(loanId: string): Promise<ApiResponse<LoanInfo>> {
    const response = await this.axiosInstance.get(`/lending/loan/${loanId}`);
    return this.handleResponse(response);
  }

  /**
   * Calculate total owed
   */
  async getTotalOwed(loanId: string): Promise<ApiResponse<TotalOwedResponse>> {
    const response = await this.axiosInstance.get(`/lending/total-owed/${loanId}`);
    return this.handleResponse(response);
  }

  /**
   * Check if loan is liquidatable
   */
  async isLoanLiquidatable(loanId: string): Promise<ApiResponse<LiquidatableResponse>> {
    const response = await this.axiosInstance.get(`/lending/liquidatable/${loanId}`);
    return this.handleResponse(response);
  }

  /**
   * Calculate loan health ratio
   */
  async getLoanHealthRatio(loanId: string): Promise<ApiResponse<HealthRatioResponse>> {
    const response = await this.axiosInstance.get(`/lending/health-ratio/${loanId}`);
    return this.handleResponse(response);
  }

  /**
   * Get user loans
   */
  async getUserLoans(userAddress: string): Promise<ApiResponse<UserLoansResponse>> {
    const response = await this.axiosInstance.get(`/lending/user-loans/${userAddress}`);
    return this.handleResponse(response);
  }

  /**
   * Get active loans
   */
  async getActiveLoans(): Promise<ApiResponse<LoanInfo[]>> {
    const response = await this.axiosInstance.get('/lending/active-loans');
    return this.handleResponse(response);
  }

  /**
   * Get liquidatable loans
   */
  async getLiquidatableLoans(): Promise<ApiResponse<LoanInfo[]>> {
    const response = await this.axiosInstance.get('/lending/liquidatable-loans');
    return this.handleResponse(response);
  }

  // =====================
  // TOKEN OPERATIONS API
  // =====================

  /**
   * Approve ERC-20 token
   */
  async approveToken(data: ApproveTokenRequest): Promise<ApiResponse<{ txHash: string }>> {
    const response = await this.axiosInstance.post('/tokens/approve', data);
    return this.handleResponse(response);
  }

  // =====================
  // FAUCET API
  // =====================

  /**
   * Mint MockUSDC tokens from faucet
   */
  async mintMockUSDC(userAddress: string, amount: number): Promise<ApiResponse<{ txHash: string }>> {
    const response = await this.axiosInstance.post('/tokens/mint-usdc', { userAddress, amount });
    return this.handleResponse(response);
  }

  // =====================
  // UTILITY METHODS
  // =====================

  /**
   * Set custom base URL
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  /**
   * Set custom timeout
   */
  setTimeout(timeout: number): void {
    this.axiosInstance.defaults.timeout = timeout;
  }

  /**
   * Add custom headers
   */
  setHeaders(headers: Record<string, string>): void {
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
  }

  /**
   * Remove authorization token
   */
  removeAuthToken(): void {
    delete this.axiosInstance.defaults.headers.Authorization;
  }
}

// Create and export a default instance
export const apiClient = new BagelNFTDeFiAPI();

// Export the class for custom instances
export default BagelNFTDeFiAPI; 