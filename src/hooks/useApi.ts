import { useMutation, useQuery, UseQueryResult, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
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

// =====================
// SYSTEM HOOKS
// =====================

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['healthCheck'],
    queryFn: () => apiClient.healthCheck(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // 1 minute
  });
};

// =====================
// ASSET MANAGEMENT HOOKS
// =====================

export const useCreateAssetMetadata = (): UseMutationResult<
  ApiResponse<AssetMetadata>,
  Error,
  CreateAssetMetadataRequest
> => {
  return useMutation({
    mutationFn: (data: CreateAssetMetadataRequest) => apiClient.createAssetMetadata(data),
  });
};

export const useMintAsset = (): UseMutationResult<
  ApiResponse<{ tokenId: string; txHash: string }>,
  Error,
  MintAssetRequest
> => {
  return useMutation({
    mutationFn: (data: MintAssetRequest) => apiClient.mintAsset(data),
  });
};

export const useUserAssets = (
  userAddress: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<string[]>, Error> => {
  return useQuery({
    queryKey: ['userAssets', userAddress],
    queryFn: () => apiClient.getUserAssets(userAddress!),
    enabled: enabled && !!userAddress,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useUserAssetsWithInfo = (
  userAddress: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<AssetInfo[]>, Error> => {
  return useQuery({
    queryKey: ['userAssetsWithInfo', userAddress],
    queryFn: async () => {
      // First get the list of asset IDs
      const userAssetsResponse = await apiClient.getUserAssets(userAddress!);
      
      if (!userAssetsResponse.success || !userAssetsResponse.data) {
        return {
          success: false,
          message: userAssetsResponse.message || 'Failed to fetch user assets',
          error: userAssetsResponse.error,
          data: []
        } as ApiResponse<AssetInfo[]>;
      }

      // Then fetch full info for each asset
      const assetInfoPromises = userAssetsResponse.data.map(async (tokenId: string) => {
        return apiClient.getAssetInfo(tokenId);
      });

      const assetInfoResponses = await Promise.all(assetInfoPromises);
      
      // Filter successful responses and extract data
      const assetInfos = assetInfoResponses
        .filter(response => response.success && response.data)
        .map(response => response.data!);

      return {
        success: true,
        message: `Fetched ${assetInfos.length} assets`,
        data: assetInfos
      } as ApiResponse<AssetInfo[]>;
    },
    enabled: enabled && !!userAddress,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useAssetInfo = (
  tokenId: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<AssetInfo>, Error> => {
  return useQuery({
    queryKey: ['assetInfo', tokenId],
    queryFn: () => apiClient.getAssetInfo(tokenId!),
    enabled: enabled && !!tokenId,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useAssetOwner = (
  tokenId: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<AssetOwnerResponse>, Error> => {
  return useQuery({
    queryKey: ['assetOwner', tokenId],
    queryFn: () => apiClient.getAssetOwner(tokenId!),
    enabled: enabled && !!tokenId,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useAssetBalance = (
  userAddress: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<AssetBalanceResponse>, Error> => {
  return useQuery({
    queryKey: ['assetBalance', userAddress],
    queryFn: () => apiClient.getAssetBalance(userAddress!),
    enabled: enabled && !!userAddress,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useAppraisalHistory = (
  tokenId: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<AppraisalHistory[]>, Error> => {
  return useQuery({
    queryKey: ['appraisalHistory', tokenId],
    queryFn: () => apiClient.getAppraisalHistory(tokenId!),
    enabled: enabled && !!tokenId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// =====================
// FRACTIONALIZATION HOOKS
// =====================

export const useApproveAssetForFractionalization = (): UseMutationResult<
  ApiResponse<{ txHash: string }>,
  Error,
  string
> => {
  return useMutation({
    mutationFn: (tokenId: string) => apiClient.approveAssetForFractionalization(tokenId),
  });
};

export const useFractionalizeAsset = (): UseMutationResult<
  ApiResponse<{ assetId: string; txHash: string }>,
  Error,
  FractionalizeAssetRequest
> => {
  return useMutation({
    mutationFn: (data: FractionalizeAssetRequest) => apiClient.fractionalizeAsset(data),
  });
};

export const useRedeemAsset = (): UseMutationResult<
  ApiResponse<{ txHash: string }>,
  Error,
  RedeemAssetRequest
> => {
  return useMutation({
    mutationFn: (data: RedeemAssetRequest) => apiClient.redeemAsset(data),
  });
};

export const useFractionalizationApprovalStatus = (
  tokenId: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<ApprovalStatusResponse>, Error> => {
  return useQuery({
    queryKey: ['fractionalizationApprovalStatus', tokenId],
    queryFn: () => apiClient.getFractionalizationApprovalStatus(tokenId!),
    enabled: enabled && !!tokenId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useFractionalizedAsset = (
  assetId: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<FractionalizationInfo>, Error> => {
  return useQuery({
    queryKey: ['fractionalizedAsset', assetId],
    queryFn: () => apiClient.getFractionalizedAsset(assetId!),
    enabled: enabled && !!assetId,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useReserveData = (
  assetId: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<ReserveData>, Error> => {
  return useQuery({
    queryKey: ['reserveData', assetId],
    queryFn: () => apiClient.getReserveData(assetId!),
    enabled: enabled && !!assetId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useFractionalizedAssetInfo = (
  tokenContract: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<AssetIdResponse>, Error> => {
  return useQuery({
    queryKey: ['fractionalizedAssetInfo', tokenContract],
    queryFn: () => apiClient.getFractionalizedAssetInfo(tokenContract!),
    enabled: enabled && !!tokenContract,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAssetTokenBalance = (
  assetId: string | undefined,
  userAddress: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<TokenBalanceResponse>, Error> => {
  return useQuery({
    queryKey: ['assetTokenBalance', assetId, userAddress],
    queryFn: () => apiClient.getAssetTokenBalance(assetId!, userAddress!),
    enabled: enabled && !!assetId && !!userAddress,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useVerifyFractionalizedToken = (): UseMutationResult<
  ApiResponse<VerifyTokenResponse>,
  Error,
  VerifyTokenRequest
> => {
  return useMutation({
    mutationFn: (data: VerifyTokenRequest) => apiClient.verifyFractionalizedToken(data),
  });
};

export const useGetTokenValue = (): UseMutationResult<
  ApiResponse<TokenValueResponse>,
  Error,
  TokenValueRequest
> => {
  return useMutation({
    mutationFn: (data: TokenValueRequest) => apiClient.getTokenValue(data),
  });
};

export const useRequestReserveVerification = (): UseMutationResult<
  ApiResponse<{ txHash: string }>,
  Error,
  RequestVerificationRequest
> => {
  return useMutation({
    mutationFn: (data: RequestVerificationRequest) => apiClient.requestReserveVerification(data),
  });
};

export const useReserveVerificationStatus = (
  assetId: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<ChainlinkRequest[]>, Error> => {
  return useQuery({
    queryKey: ['reserveVerificationStatus', assetId],
    queryFn: () => apiClient.getReserveVerificationStatus(assetId!),
    enabled: enabled && !!assetId,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // 30 seconds for pending requests
  });
};

// =====================
// LENDING HOOKS
// =====================

export const useProvideLiquidity = (): UseMutationResult<
  ApiResponse<{ txHash: string; lpToken: string }>,
  Error,
  ProvideLiquidityRequest
> => {
  return useMutation({
    mutationFn: (data: ProvideLiquidityRequest) => apiClient.provideLiquidity(data),
  });
};

export const useWithdrawLiquidity = (): UseMutationResult<
  ApiResponse<{ txHash: string }>,
  Error,
  WithdrawLiquidityRequest
> => {
  return useMutation({
    mutationFn: (data: WithdrawLiquidityRequest) => apiClient.withdrawLiquidity(data),
  });
};

export const useApproveAssetForLending = (): UseMutationResult<
  ApiResponse<{ txHash: string }>,
  Error,
  string
> => {
  return useMutation({
    mutationFn: (tokenId: string) => apiClient.approveAssetForLending(tokenId),
  });
};

export const useApproveTokenForLending = (): UseMutationResult<
  ApiResponse<{ txHash: string }>,
  Error,
  number
> => {
  return useMutation({
    mutationFn: (amount: number) => apiClient.approveTokenForLending(amount),
  });
};

export const useLendingApprovalStatus = (
  tokenId: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<ApprovalStatusResponse>, Error> => {
  return useQuery({
    queryKey: ['lendingApprovalStatus', tokenId],
    queryFn: () => apiClient.getLendingApprovalStatus(tokenId!),
    enabled: enabled && !!tokenId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useRecommendedLoanAmount = (
  tokenId: string | undefined,
  loanTokenAddress: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<RecommendedLoanAmount>, Error> => {
  return useQuery({
    queryKey: ['recommendedLoanAmount', tokenId, loanTokenAddress],
    queryFn: () => apiClient.getRecommendedLoanAmount(tokenId!, loanTokenAddress!),
    enabled: enabled && !!tokenId && !!loanTokenAddress,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useCreateLoan = (): UseMutationResult<
  ApiResponse<{ loanId: string; txHash: string }>,
  Error,
  CreateLoanRequest
> => {
  return useMutation({
    mutationFn: (data: CreateLoanRequest) => apiClient.createLoan(data),
  });
};

export const useRepayLoan = (): UseMutationResult<
  ApiResponse<{ txHash: string }>,
  Error,
  RepayLoanRequest
> => {
  return useMutation({
    mutationFn: (data: RepayLoanRequest) => apiClient.repayLoan(data),
  });
};

export const useLiquidateLoan = (): UseMutationResult<
  ApiResponse<{ txHash: string }>,
  Error,
  LiquidateLoanRequest
> => {
  return useMutation({
    mutationFn: (data: LiquidateLoanRequest) => apiClient.liquidateLoan(data),
  });
};

export const useLoanInfo = (
  loanId: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<LoanInfo>, Error> => {
  return useQuery({
    queryKey: ['loanInfo', loanId],
    queryFn: () => apiClient.getLoanInfo(loanId!),
    enabled: enabled && !!loanId,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useTotalOwed = (
  loanId: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<TotalOwedResponse>, Error> => {
  return useQuery({
    queryKey: ['totalOwed', loanId],
    queryFn: () => apiClient.getTotalOwed(loanId!),
    enabled: enabled && !!loanId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useIsLoanLiquidatable = (
  loanId: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<LiquidatableResponse>, Error> => {
  return useQuery({
    queryKey: ['isLoanLiquidatable', loanId],
    queryFn: () => apiClient.isLoanLiquidatable(loanId!),
    enabled: enabled && !!loanId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useLoanHealthRatio = (
  loanId: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<HealthRatioResponse>, Error> => {
  return useQuery({
    queryKey: ['loanHealthRatio', loanId],
    queryFn: () => apiClient.getLoanHealthRatio(loanId!),
    enabled: enabled && !!loanId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useUserLoans = (
  userAddress: string | undefined,
  enabled: boolean = true
): UseQueryResult<ApiResponse<UserLoansResponse>, Error> => {
  return useQuery({
    queryKey: ['userLoans', userAddress],
    queryFn: () => apiClient.getUserLoans(userAddress!),
    enabled: enabled && !!userAddress,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useActiveLoans = (
  enabled: boolean = true
): UseQueryResult<ApiResponse<LoanInfo[]>, Error> => {
  return useQuery({
    queryKey: ['activeLoans'],
    queryFn: () => apiClient.getActiveLoans(),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // 1 minute
  });
};

export const useLiquidatableLoans = (
  enabled: boolean = true
): UseQueryResult<ApiResponse<LoanInfo[]>, Error> => {
  return useQuery({
    queryKey: ['liquidatableLoans'],
    queryFn: () => apiClient.getLiquidatableLoans(),
    enabled,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // 30 seconds
  });
};

// =====================
// TOKEN OPERATIONS HOOKS
// =====================

export const useApproveToken = (): UseMutationResult<
  ApiResponse<{ txHash: string }>,
  Error,
  ApproveTokenRequest
> => {
  return useMutation({
    mutationFn: (data: ApproveTokenRequest) => apiClient.approveToken(data),
  });
};

// =====================
// FAUCET HOOKS
// =====================

export const useMintMockUSDC = (): UseMutationResult<
  ApiResponse<{ txHash: string }>,
  Error,
  { userAddress: string; amount: number }
> => {
  return useMutation({
    mutationFn: (data: { userAddress: string; amount: number }) => 
      apiClient.mintMockUSDC(data.userAddress, data.amount),
  });
};

// =====================
// UTILITY HOOKS
// =====================

/**
 * Hook to invalidate multiple queries at once
 */
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateUserAssets: (userAddress: string) => {
      queryClient.invalidateQueries({ queryKey: ['userAssets', userAddress] });
    },
    invalidateAssetInfo: (tokenId: string) => {
      queryClient.invalidateQueries({ queryKey: ['assetInfo', tokenId] });
    },
    invalidateLoanInfo: (loanId: string) => {
      queryClient.invalidateQueries({ queryKey: ['loanInfo', loanId] });
    },
    invalidateUserLoans: (userAddress: string) => {
      queryClient.invalidateQueries({ queryKey: ['userLoans', userAddress] });
    },
    invalidateAll: () => {
      queryClient.invalidateQueries();
    },
  };
}; 