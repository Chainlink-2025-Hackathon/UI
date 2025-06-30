'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Shield, AlertTriangle, ChevronDown, Loader2, CheckCircle } from 'lucide-react';
import { useWriteContract } from 'wagmi';
import { useWallet } from '@/hooks/useWallet';
import { useTransaction } from '@/hooks/useTransaction';
import { TransactionModal } from '@/components/wallet';
import Link from 'next/link';
import { 
  useUserAssets, 
  useApproveAssetForLending, 
  useRecommendedLoanAmount,
  useCreateLoan,
  useLendingApprovalStatus,
  useInvalidateQueries,
  useApproveTokenForLending,
  useProvideLiquidity
} from '@/hooks/useApi';
import { CreateLoanRequest, AssetInfo, ProvideLiquidityRequest } from '@/types/api';

interface LendingInterfaceProps {
  onLoanCreated?: (loanId: string) => void;
}

// Extended AssetInfo to handle the actual API response structure
interface AssetData extends Omit<AssetInfo, 'tokenId' | 'appraisalValue' | 'lastAppraisalDate' | 'originChain'> {
  tokenId: bigint;
  appraisalValue: bigint;
  lastAppraisalDate: bigint;
  originChain: bigint;
}

export default function LendingInterface({ onLoanCreated }: LendingInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'borrow' | 'lend'>('borrow');
  const [selectedTokenId, setSelectedTokenId] = useState<string>('');
  const [isAssetSelectorOpen, setIsAssetSelectorOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDuration, setLoanDuration] = useState(30);
  const [loanTokenAddress] = useState('0x2F40c6332140FEaE440372dA6D0231B34CE9080B'); // Default MockUSDC address
  const [approvalCompleted, setApprovalCompleted] = useState(false);
  
  // Lend tab state
  const [lendAmount, setLendAmount] = useState('');
  const [tokenApprovalCompleted, setTokenApprovalCompleted] = useState(false);

  // Wallet integration
  const { address, isConnected } = useWallet();

  // API hooks - getUserAssets returns full asset data
  const { data: userAssetsResponse, isLoading: loadingAssets } = useUserAssets(address, isConnected);
  const userAssets = (userAssetsResponse?.data || []) as unknown as AssetData[];

  // Find selected asset info from the user assets
  const selectedAssetInfo = userAssets.find(asset => asset.tokenId.toString() === selectedTokenId);

  // API mutations
  const approveAsset = useApproveAssetForLending();
  const createLoan = useCreateLoan();
  const approveToken = useApproveTokenForLending();
  const provideLiquidity = useProvideLiquidity();
  const { invalidateUserAssets } = useInvalidateQueries();

  // Get approval status for selected asset
  const { data: approvalStatusResponse, refetch: refetchApprovalStatus } = useLendingApprovalStatus(selectedTokenId, !!selectedTokenId);
  const isApproved = approvalStatusResponse?.data?.isApproved || false;

  // Reset approval completed state when asset changes
  useEffect(() => {
    setApprovalCompleted(false);
  }, [selectedTokenId]);

  // Get recommended loan amount
  const { data: recommendedLoanResponse, isLoading: loadingRecommendation } = useRecommendedLoanAmount(
    selectedTokenId, 
    loanTokenAddress, 
    !!selectedTokenId && !!loanTokenAddress
  );
  
  // Safely extract values with proper type checking
  const recommendedLoanAmount = recommendedLoanResponse?.data?.recommendedAmount ? String(recommendedLoanResponse.data.recommendedAmount) : '0';
  const maxLoanAmount = recommendedLoanResponse?.data?.maxAmount ? String(recommendedLoanResponse.data.maxAmount) : '0';
  const interestRate = recommendedLoanResponse?.data?.interestRate ? String(recommendedLoanResponse.data.interestRate) : '0';

  // Transaction management
  const approvalTransaction = useTransaction({
    title: 'Approve Asset for Lending',
    description: 'Approving your asset for lending',
    requiredConfirmations: 1,
    onSuccess: async () => {
      console.log('Asset approved for lending successfully');
      // Set local approval state immediately
      setApprovalCompleted(true);
      console.log('Set approvalCompleted to true');
      // Also refetch approval status from API
      try {
        await refetchApprovalStatus();
        console.log('Approval status refetched successfully');
      } catch (error) {
        console.error('Failed to refetch approval status:', error);
      }
    },
    onError: (error) => {
      console.error('Approval error:', error);
    }
  });

  const loanTransaction = useTransaction({
    title: 'Create Asset-Backed Loan',
    description: 'Creating your asset-backed loan',
    requiredConfirmations: 2,
    onSuccess: () => {
      // Invalidate user assets to refresh the list
      if (address) {
        invalidateUserAssets(address);
      }
      onLoanCreated?.(selectedTokenId);
    },
    onError: (error) => {
      console.error('Loan creation error:', error);
    }
  });

  // Transaction management for lending
  const tokenApprovalTransaction = useTransaction({
    title: 'Approve USDC for Lending',
    description: 'Approving USDC tokens for lending pool',
    requiredConfirmations: 1,
    onSuccess: async () => {
      console.log('USDC approved for lending successfully');
      setTokenApprovalCompleted(true);
    },
    onError: (error) => {
      console.error('Token approval error:', error);
    }
  });

  const liquidityTransaction = useTransaction({
    title: 'Provide Liquidity',
    description: 'Adding liquidity to the lending pool',
    requiredConfirmations: 2,
    onSuccess: () => {
      console.log('Liquidity provided successfully');
      // Reset form
      setLendAmount('');
      setTokenApprovalCompleted(false);
    },
    onError: (error) => {
      console.error('Liquidity provision error:', error);
    }
  });

  // Wagmi hook for contract interactions
  const { writeContract } = useWriteContract();

  // Helper functions
  const formatAppraisalValue = (value: bigint): string => {
    // Convert from wei to ETH and format
    const ethValue = Number(value) / Math.pow(10, 6);
    return ethValue.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 6 
    });
  };

  const getAssetTypeDisplay = (assetType: string): string => {
    const typeMap: Record<string, string> = {
      'art': 'Art',
      'artwork': 'Artwork', 
      'commodity': 'Commodity',
      'real-estate': 'Real Estate'
    };
    return typeMap[assetType] || assetType;
  };

  const calculateTotalRepayment = (): string => {
    if (!loanAmount || !interestRate || interestRate === '0') return '0';
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100;
    const daysInYear = 365;
    const interest = principal * rate * (loanDuration / daysInYear);
    return (principal + interest).toFixed(2);
  };

  const handleApproveAsset = async () => {
    if (!selectedTokenId) return;

    try {
      console.log('Starting asset approval for tokenId:', selectedTokenId);
      approvalTransaction.setTransactionPending();
      
      const approvalRes = await approveAsset.mutateAsync(selectedTokenId);
      if (!approvalRes.data) throw new Error('Failed to get approval transaction data');

      // Handle contract call data
      const contractCallData = approvalRes.contractCall || approvalRes.data;
      
      if (contractCallData && typeof contractCallData === 'object' && 'address' in contractCallData) {
        const callData = contractCallData as {
          address: string;
          abi: readonly unknown[];
          functionName: string;
          args?: readonly unknown[];
          value?: bigint;
        };
        
        const contractConfig = {
          address: callData.address as `0x${string}`,
          abi: callData.abi,
          functionName: callData.functionName,
          args: callData.args || [],
        };
        
        if (callData.value && callData.value > BigInt(0)) {
          (contractConfig as typeof contractConfig & { value: bigint }).value = callData.value;
        }
        
        writeContract(contractConfig, {
          onSuccess: (hash) => {
            console.log('Approval transaction submitted with hash:', hash);
            approvalTransaction.startTransaction(hash);
          },
          onError: (error) => {
            console.error('Approval writeContract error:', error);
            approvalTransaction.setTransactionError(error.message);
          }
        });
      } else {
        // Fallback for direct transaction hash
        if ('txHash' in approvalRes.data) {
          console.log('Using direct transaction hash for approval:', approvalRes.data.txHash);
          approvalTransaction.startTransaction(approvalRes.data.txHash);
        } else {
          throw new Error('Invalid approval response format');
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve asset';
      console.error('Asset approval error:', errorMessage);
      approvalTransaction.setTransactionError(errorMessage);
    }
  };

  const handleCreateLoan = async () => {
    if (!selectedTokenId || !loanAmount || !interestRate) {
      console.log('Create loan validation failed:', { selectedTokenId, loanAmount, interestRate });
      return;
    }

    try {
      console.log('Starting loan creation with data:', {
        selectedTokenId,
        loanAmount,
        interestRate,
        loanDuration,
        isApproved,
        approvalCompleted
      });
      
      loanTransaction.setTransactionPending();

      // Create loan request matching the API contract
      const createLoanReq: CreateLoanRequest = {
        tokenId: selectedTokenId,
        amount: parseFloat(loanAmount),
        intrestRate: parseFloat(interestRate), // Note: API has typo "intrestRate"
        duration: loanDuration,
      };
      
      const loanRes = await createLoan.mutateAsync(createLoanReq);
      if (!loanRes.data) throw new Error('Failed to get loan creation transaction data');

      // Handle contract call data
      const contractCallData = loanRes.contractCall || loanRes.data;
      
      if (contractCallData && typeof contractCallData === 'object' && 'address' in contractCallData) {
        const callData = contractCallData as {
          address: string;
          abi: readonly unknown[];
          functionName: string;
          args?: readonly unknown[];
          value?: bigint;
        };
        
        const contractConfig = {
          address: callData.address as `0x${string}`,
          abi: callData.abi,
          functionName: callData.functionName,
          args: callData.args || [],
        };
        
        if (callData.value && callData.value > BigInt(0)) {
          (contractConfig as typeof contractConfig & { value: bigint }).value = callData.value;
        }
        
        writeContract(contractConfig, {
          onSuccess: (hash) => {
            console.log('Loan creation transaction submitted with hash:', hash);
            loanTransaction.startTransaction(hash);
          },
          onError: (error) => {
            console.error('Loan creation writeContract error:', error);
            loanTransaction.setTransactionError(error.message);
          }
        });
      } else {
        // Fallback for direct transaction hash
        if ('txHash' in loanRes.data) {
          console.log('Using direct transaction hash for loan creation:', loanRes.data.txHash);
          loanTransaction.startTransaction(loanRes.data.txHash);
        } else {
          throw new Error('Invalid loan creation response format');
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create loan';
      console.error('Loan creation error:', errorMessage);
      loanTransaction.setTransactionError(errorMessage);
    }
  };

  const handleApproveToken = async () => {
    if (!lendAmount) return;

    try {
      console.log('Starting token approval for amount:', lendAmount);
      tokenApprovalTransaction.setTransactionPending();
      
      const approvalRes = await approveToken.mutateAsync(parseFloat(lendAmount));
      if (!approvalRes.data) throw new Error('Failed to get token approval transaction data');

      // Handle contract call data
      const contractCallData = approvalRes.contractCall || approvalRes.data;
      
      if (contractCallData && typeof contractCallData === 'object' && 'address' in contractCallData) {
        const callData = contractCallData as {
          address: string;
          abi: readonly unknown[];
          functionName: string;
          args?: readonly unknown[];
          value?: bigint;
        };
        
        const contractConfig = {
          address: callData.address as `0x${string}`,
          abi: callData.abi,
          functionName: callData.functionName,
          args: callData.args || [],
        };
        
        if (callData.value && callData.value > BigInt(0)) {
          (contractConfig as typeof contractConfig & { value: bigint }).value = callData.value;
        }
        
        writeContract(contractConfig, {
          onSuccess: (hash) => {
            console.log('Token approval transaction submitted with hash:', hash);
            tokenApprovalTransaction.startTransaction(hash);
          },
          onError: (error) => {
            console.error('Token approval writeContract error:', error);
            tokenApprovalTransaction.setTransactionError(error.message);
          }
        });
      } else {
        // Fallback for direct transaction hash
        if ('txHash' in approvalRes.data) {
          console.log('Using direct transaction hash for token approval:', approvalRes.data.txHash);
          tokenApprovalTransaction.startTransaction(approvalRes.data.txHash);
        } else {
          throw new Error('Invalid token approval response format');
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve token';
      console.error('Token approval error:', errorMessage);
      tokenApprovalTransaction.setTransactionError(errorMessage);
    }
  };

  const handleProvideLiquidity = async () => {
    if (!lendAmount) return;

    try {
      console.log('Starting liquidity provision for amount:', lendAmount);
      liquidityTransaction.setTransactionPending();

      const liquidityReq: ProvideLiquidityRequest = {
        amount: parseFloat(lendAmount),
      };
      
      const liquidityRes = await provideLiquidity.mutateAsync(liquidityReq);
      if (!liquidityRes.data) throw new Error('Failed to get liquidity provision transaction data');

      // Handle contract call data
      const contractCallData = liquidityRes.contractCall || liquidityRes.data;
      
      if (contractCallData && typeof contractCallData === 'object' && 'address' in contractCallData) {
        const callData = contractCallData as {
          address: string;
          abi: readonly unknown[];
          functionName: string;
          args?: readonly unknown[];
          value?: bigint;
        };
        
        const contractConfig = {
          address: callData.address as `0x${string}`,
          abi: callData.abi,
          functionName: callData.functionName,
          args: callData.args || [],
        };
        
        if (callData.value && callData.value > BigInt(0)) {
          (contractConfig as typeof contractConfig & { value: bigint }).value = callData.value;
        }
        
        writeContract(contractConfig, {
          onSuccess: (hash) => {
            console.log('Liquidity provision transaction submitted with hash:', hash);
            liquidityTransaction.startTransaction(hash);
          },
          onError: (error) => {
            console.error('Liquidity provision writeContract error:', error);
            liquidityTransaction.setTransactionError(error.message);
          }
        });
      } else {
        // Fallback for direct transaction hash
        if ('txHash' in liquidityRes.data) {
          console.log('Using direct transaction hash for liquidity provision:', liquidityRes.data.txHash);
          liquidityTransaction.startTransaction(liquidityRes.data.txHash);
        } else {
          throw new Error('Invalid liquidity provision response format');
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to provide liquidity';
      console.error('Liquidity provision error:', errorMessage);
      liquidityTransaction.setTransactionError(errorMessage);
    }
  };

  const isLoading = approvalTransaction.isLoading || loanTransaction.isLoading || tokenApprovalTransaction.isLoading || liquidityTransaction.isLoading;

  return (
    <>
    <div className="max-w-4xl mx-auto p-3 sm:p-4 lg:p-6 bg-card rounded-lg border border-card-border">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <DollarSign className="w-5 sm:w-6 h-5 sm:h-6 text-accent" />
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Asset-Backed Lending</h2>
      </div>

      {/* Wallet Connection Warning */}
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-800 text-sm">Please connect your wallet to access lending features.</p>
        </div>
      )}

      {isConnected && (
        <>
      {/* Tab Navigation - Mobile Optimized */}
      <div className="flex border-b border-card-border mb-4 sm:mb-6">
        <button
          onClick={() => setActiveTab('borrow')}
          className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base ${
            activeTab === 'borrow' 
              ? 'border-b-2 border-accent text-accent' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="sm:hidden">Borrow</span>
          <span className="hidden sm:inline">Borrow Against Asset</span>
        </button>
        <button
          onClick={() => setActiveTab('lend')}
          className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base ${
            activeTab === 'lend' 
              ? 'border-b-2 border-accent text-accent' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="sm:hidden">Lend</span>
          <span className="hidden sm:inline">Lend to Others</span>
        </button>
      </div>

      {activeTab === 'borrow' && (
        <div className="space-y-4 sm:space-y-6">
              {/* Asset Selection */}
          <div>
                <label className="block text-sm font-medium mb-2">Select NFT Asset for Collateral</label>
                <div className="relative">
              <button
                    type="button"
                    onClick={() => setIsAssetSelectorOpen(!isAssetSelectorOpen)}
                    disabled={loadingAssets}
                    className="w-full flex items-center justify-between px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm hover:bg-card transition-colors disabled:opacity-50"
                  >
                    <span>
                      {loadingAssets ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading assets...
                        </span>
                      ) : selectedAssetInfo ? (
                        `${selectedAssetInfo.metadata?.name || `Token ${selectedTokenId}`} - ${formatAppraisalValue(selectedAssetInfo.appraisalValue)} ETH`
                      ) : userAssets.length > 0 ? (
                        'Choose an asset'
                      ) : (
                        'No assets found'
                      )}
                    </span>
                    <ChevronDown className="w-4 h-4" />
              </button>
              
                  {/* Dropdown */}
                  {isAssetSelectorOpen && !loadingAssets && (
                    <div className="absolute z-10 w-full mt-1 bg-background border border-card-border rounded-md shadow-lg max-h-60 overflow-auto">
                      {userAssets.length > 0 ? userAssets.map((asset) => (
                <button
                          key={asset.tokenId.toString()}
                          onClick={() => {
                            setSelectedTokenId(asset.tokenId.toString());
                            setIsAssetSelectorOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-card transition-colors border-b border-card-border last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {asset.metadata?.name || `Token #${asset.tokenId.toString()}`}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {getAssetTypeDisplay(asset.assetType)} • {formatAppraisalValue(asset.appraisalValue)} ETH • {asset.physicalLocation}
                              </div>
                            </div>
                          </div>
                </button>
                      )) : (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          No eligible assets found
                        </div>
                      )}
                    </div>
              )}
            </div>
          </div>

              {/* Asset Preview */}
              {selectedAssetInfo && (
                <div className="bg-background rounded-lg p-3 sm:p-4 border border-card-border">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-lg bg-accent/20 flex items-center justify-center mx-auto sm:mx-0">
                      <Shield className="w-8 h-8 text-accent" />
                    </div>
                    <div className="text-center sm:text-left w-full">
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-1">
                        {selectedAssetInfo.metadata?.name || `Asset #${selectedTokenId}`}
                      </h3>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-2">
                        <div className="text-center sm:text-left">
                          <p className="text-xs text-muted-foreground">Current Value</p>
                          <p className="font-semibold text-sm">{formatAppraisalValue(selectedAssetInfo.appraisalValue)} ETH</p>
                        </div>
                        <div className="text-center sm:text-left">
                          <p className="text-xs text-muted-foreground">Asset Type</p>
                          <p className="font-semibold text-sm">{getAssetTypeDisplay(selectedAssetInfo.assetType)}</p>
                        </div>
                        <div className="text-center sm:text-left">
                          <p className="text-xs text-muted-foreground">Max Loan</p>
                          <p className="font-semibold text-sm">
                            {loadingRecommendation ? (
                              <Loader2 className="w-4 h-4 animate-spin inline" />
                            ) : (
                              `${maxLoanAmount} USDC`
                            )}
                          </p>
                        </div>
                        <div className="text-center sm:text-left">
                          <p className="text-xs text-muted-foreground">Recommended</p>
                          <p className="font-semibold text-sm">
                            {loadingRecommendation ? (
                              <Loader2 className="w-4 h-4 animate-spin inline" />
                            ) : (
                              `${recommendedLoanAmount} USDC`
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTokenId && (
                <>
                  {/* Approval Status */}
                  {!isApproved && !approvalCompleted ? (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-yellow-600">Asset Approval Required</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            You need to approve this asset for lending before you can create a loan.
                          </p>
                        </div>
                        <button
                          onClick={handleApproveAsset}
                          disabled={isLoading}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 text-sm"
                        >
                          {approvalTransaction.isLoading ? 'Approving...' : 'Approve Asset'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-md p-3 sm:p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-semibold text-green-600">Asset Approved for Lending</span>
                      </div>
                    </div>
                  )}

                  {/* Loan Parameters - Only show if approved */}
                  {(isApproved || approvalCompleted) && (
                    <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Loan Amount (USDC)</label>
              <input
                type="number"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
                            placeholder={recommendedLoanAmount}
                            max={maxLoanAmount}
              />
              <p className="text-xs text-muted-foreground mt-1">
                            Maximum: {maxLoanAmount} USDC • Recommended: {recommendedLoanAmount} USDC
              </p>
            </div>

            <div>
                          <label className="block text-sm font-medium mb-2">Interest Rate</label>
                          <div className="px-3 py-2 border border-card-border rounded-md bg-muted text-foreground text-sm">
                            {loadingRecommendation ? (
                              <Loader2 className="w-4 h-4 animate-spin inline" />
                            ) : (
                              `${interestRate}% APR`
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Rate determined by asset risk assessment
                          </p>
            </div>
          </div>

                      {/* Loan Duration */}
          <div>
            <label className="block text-sm font-medium mb-2">Loan Duration</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[7, 14, 30, 90].map((days) => (
                <button
                  key={days}
                              onClick={() => setLoanDuration(days)}
                  className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium ${
                                loanDuration === days
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-background border border-card-border text-foreground'
                  }`}
                >
                  {days} days
                </button>
              ))}
            </div>
          </div>

                      {/* Loan Summary */}
                      {loanAmount && interestRate && interestRate !== '0' && (
          <div className="bg-accent/10 border border-accent/20 rounded-md p-3 sm:p-4">
            <h3 className="font-semibold text-accent mb-3 text-sm sm:text-base">Loan Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loan Amount:</span>
                              <span className="font-semibold">{loanAmount} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest Rate:</span>
                              <span className="font-semibold">{interestRate}% APR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                              <span className="font-semibold">{loanDuration} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Repayment:</span>
                              <span className="font-semibold">{calculateTotalRepayment()} USDC</span>
              </div>
            </div>
          </div>
                      )}

          {/* Risk Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-3 sm:p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-500 text-sm sm:text-base">Risk Warning</h4>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                              If you fail to repay the loan by the due date, your NFT collateral may be liquidated through an auction. 
                  Ensure you can meet the repayment terms before proceeding.
                </p>
              </div>
            </div>
          </div>

          {/* Create Loan Button */}
          <button
            onClick={handleCreateLoan}
                        disabled={isLoading || !loanAmount || !(isApproved || approvalCompleted)}
            className="w-full bg-accent text-accent-foreground font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 text-sm sm:text-base"
          >
                        {loanTransaction.isLoading ? 'Creating Loan...' : 'Create Loan Request'}
          </button>
                    </>
                  )}
                </>
              )}
        </div>
      )}

      {activeTab === 'lend' && (
        <div className="space-y-4 sm:space-y-6">
              <div className="bg-background rounded-lg p-4 border border-card-border">
                <h3 className="text-lg font-semibold mb-4">Provide Liquidity to Lending Pool</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Earn yield by providing USDC liquidity to fund asset-backed loans. Your funds will be used to provide loans to borrowers using NFT collateral.
                </p>

                {/* Need MockUSDC? */}
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Need Test USDC?</h4>
                      <p className="text-sm text-blue-700">
                        Get free MockUSDC tokens for testing on the faucet page.
                      </p>
                    </div>
                    <Link
                      href="/faucet"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      Get USDC
                    </Link>
                  </div>
                </div>

                {/* Lending Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Amount to Lend (USDC)</label>
                  <input
                    type="number"
                    value={lendAmount}
                    onChange={(e) => setLendAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
                    placeholder="Enter USDC amount"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum deposit: 100 USDC
                  </p>
                </div>

                {/* Two-step process */}
                {lendAmount && parseFloat(lendAmount) > 0 && (
                  <>
                    {/* Step 1: Token Approval */}
                    {!tokenApprovalCompleted ? (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-blue-600">Step 1: Approve USDC</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Allow the lending pool to use your USDC tokens.
                            </p>
                          </div>
                          <button
                            onClick={handleApproveToken}
                            disabled={isLoading || !lendAmount}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
                          >
                            {tokenApprovalTransaction.isLoading ? 'Approving...' : 'Approve USDC'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-md p-4 mb-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-semibold text-green-600">USDC Approved</span>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Provide Liquidity */}
                    {tokenApprovalCompleted && (
                      <div className="bg-accent/10 border border-accent/20 rounded-md p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-accent">Step 2: Provide Liquidity</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Deposit {lendAmount} USDC to the lending pool.
                            </p>
                          </div>
                          <button
                            onClick={handleProvideLiquidity}
                            disabled={isLoading || !lendAmount}
                            className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                          >
                            {liquidityTransaction.isLoading ? 'Depositing...' : 'Provide Liquidity'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Liquidity Summary */}
                    <div className="bg-card/50 rounded-lg p-4 border border-card-border">
                      <h4 className="font-semibold mb-3">Liquidity Summary</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Deposit Amount:</span>
                          <span className="font-semibold">{lendAmount} USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expected APY:</span>
                          <span className="font-semibold text-green-600">8-12%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">LP Tokens:</span>
                          <span className="font-semibold">~{lendAmount} LP-USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lock Period:</span>
                          <span className="font-semibold">None</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Benefits */}
                <div className="mt-6 bg-green-500/10 border border-green-500/20 rounded-md p-4">
                  <h4 className="font-semibold text-green-600 mb-2">Benefits of Providing Liquidity</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Earn competitive yields from loan interest payments</li>
                    <li>• Loans are over-collateralized with verified NFT assets</li>
                    <li>• Automated liquidation protects your principal</li>
                    <li>• Withdraw your funds anytime (subject to pool liquidity)</li>
                  </ul>
                </div>
          </div>
        </div>
      )}

      {/* Chainlink Integration Notice */}
      <div className="mt-4 sm:mt-6 bg-accent/10 border border-accent/20 rounded-md p-3 sm:p-4">
        <h3 className="font-semibold text-accent mb-2 text-sm sm:text-base">Powered by Chainlink</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Asset valuations powered by Chainlink Price Feeds. Automated liquidations handled by Chainlink Automation. 
          Cross-chain lending enabled through Chainlink CCIP.
        </p>
      </div>
        </>
      )}
    </div>

    {/* Transaction Modals */}
    <TransactionModal
      isOpen={approvalTransaction.isModalOpen}
      onClose={approvalTransaction.closeModal}
      status={approvalTransaction.status}
      hash={approvalTransaction.transactionHash}
      title={approvalTransaction.title}
      description={approvalTransaction.description}
      error={approvalTransaction.error}
      confirmations={approvalTransaction.confirmations}
      requiredConfirmations={approvalTransaction.requiredConfirmations}
    />

    <TransactionModal
      isOpen={loanTransaction.isModalOpen}
      onClose={loanTransaction.closeModal}
      status={loanTransaction.status}
      hash={loanTransaction.transactionHash}
      title={loanTransaction.title}
      description={loanTransaction.description}
      error={loanTransaction.error}
      confirmations={loanTransaction.confirmations}
      requiredConfirmations={loanTransaction.requiredConfirmations}
    />

    <TransactionModal
      isOpen={tokenApprovalTransaction.isModalOpen}
      onClose={tokenApprovalTransaction.closeModal}
      status={tokenApprovalTransaction.status}
      hash={tokenApprovalTransaction.transactionHash}
      title={tokenApprovalTransaction.title}
      description={tokenApprovalTransaction.description}
      error={tokenApprovalTransaction.error}
      confirmations={tokenApprovalTransaction.confirmations}
      requiredConfirmations={tokenApprovalTransaction.requiredConfirmations}
    />

    <TransactionModal
      isOpen={liquidityTransaction.isModalOpen}
      onClose={liquidityTransaction.closeModal}
      status={liquidityTransaction.status}
      hash={liquidityTransaction.transactionHash}
      title={liquidityTransaction.title}
      description={liquidityTransaction.description}
      error={liquidityTransaction.error}
      confirmations={liquidityTransaction.confirmations}
      requiredConfirmations={liquidityTransaction.requiredConfirmations}
    />
    </>
  );
} 