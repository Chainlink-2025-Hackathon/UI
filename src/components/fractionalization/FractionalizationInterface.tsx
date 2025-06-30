'use client';

import { useState } from 'react';
import { Scissors, Share2, Lock, PieChart, ChevronDown, Loader2, Shield } from 'lucide-react';
import { useWriteContract } from 'wagmi';
import { useWallet } from '@/hooks/useWallet';
import { useTransaction } from '@/hooks/useTransaction';
import { TransactionModal } from '@/components/wallet';
import { 
  useUserAssets, 
  useApproveAssetForFractionalization, 
  useFractionalizeAsset 
} from '@/hooks/useApi';
import { FractionalizeAssetRequest, AssetInfo } from '@/types/api';

interface FractionalizationInterfaceProps {
  onSuccess?: (assetId: string) => void;
}

// Extended AssetInfo to handle the actual API response structure
interface AssetData extends Omit<AssetInfo, 'tokenId' | 'appraisalValue' | 'lastAppraisalDate' | 'originChain'> {
  tokenId: bigint;
  appraisalValue: bigint;
  lastAppraisalDate: bigint;
  originChain: bigint;
}

export default function FractionalizationInterface({ 
  onSuccess
}: FractionalizationInterfaceProps) {
  const [selectedTokenId, setSelectedTokenId] = useState<string>('');
  const [fractionalSupply, setFractionalSupply] = useState('1000');
  const [reservePrice, setReservePrice] = useState('');
  const [isAssetSelectorOpen, setIsAssetSelectorOpen] = useState(false);
  const [approvalCompleted, setApprovalCompleted] = useState(false);

  // Wallet integration
  const { address, isConnected } = useWallet();

  // API hooks - getUserAssets already returns full asset data
  const { data: userAssetsResponse, isLoading: loadingAssets } = useUserAssets(address, isConnected);
  const userAssets = (userAssetsResponse?.data || []) as AssetData[];

  // Find selected asset info from the user assets
  const selectedAssetInfo = userAssets.find(asset => asset.tokenId.toString() === selectedTokenId);

  // API mutations
  const approveAsset = useApproveAssetForFractionalization();
  const fractionalizeAsset = useFractionalizeAsset();

  // Transaction management
  const approvalTransaction = useTransaction({
    title: 'Approve Asset for Fractionalization',
    description: 'Approving your asset for fractionalization',
    requiredConfirmations: 1, // Approval needs 1 confirmation
    onSuccess: () => {
      setApprovalCompleted(true);
    },
    onError: (error) => {
      console.error('Approval error:', error);
    }
  });

  const fractionalizationTransaction = useTransaction({
    title: 'Fractionalize Asset',
    description: 'Fractionalizing your asset into tradeable tokens',
    requiredConfirmations: 2, // Fractionalization needs 2 confirmations for security
    onSuccess: () => {
      onSuccess?.(selectedTokenId);
    },
    onError: (error) => {
      console.error('Fractionalization error:', error);
    }
  });

  // Wagmi hook for contract interactions
  const { writeContract } = useWriteContract();

  // Helper functions
  const formatAppraisalValue = (value: bigint): string => {
    // Convert from wei to ETH and format
    const ethValue = Number(value) / Math.pow(10, 18);
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

  const handleApproveAsset = async () => {
    if (!selectedTokenId) return;

    try {
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
        
        writeContract({
          address: callData.address as `0x${string}`,
          abi: callData.abi,
          functionName: callData.functionName,
          args: callData.args || [],
          ...(callData.value && callData.value > BigInt(0) ? { value: callData.value } : {}),
        }, {
          onSuccess: (hash) => {
            approvalTransaction.startTransaction(hash);
          },
          onError: (error) => {
            approvalTransaction.setTransactionError(error.message);
          }
        });
      } else {
        // Fallback for direct transaction hash
        if ('txHash' in approvalRes.data) {
          approvalTransaction.startTransaction(approvalRes.data.txHash);
        } else {
          throw new Error('Invalid approval response format');
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve asset';
      approvalTransaction.setTransactionError(errorMessage);
    }
  };

  const handleFractionalize = async () => {
    if (!selectedTokenId || !fractionalSupply || !reservePrice) return;

    try {
      fractionalizationTransaction.setTransactionPending();

      const fractionalizeReq: FractionalizeAssetRequest = {
        tokenId: selectedTokenId,
        fractionalSupply,
        reservePrice,
      };
      
      const fractionalizeRes = await fractionalizeAsset.mutateAsync(fractionalizeReq);
      if (!fractionalizeRes.data) throw new Error('Failed to get fractionalization transaction data');

      // Handle contract call data
      const contractCallData = fractionalizeRes.contractCall || fractionalizeRes.data;
      
      if (contractCallData && typeof contractCallData === 'object' && 'address' in contractCallData) {
        const callData = contractCallData as {
          address: string;
          abi: readonly unknown[];
          functionName: string;
          args?: readonly unknown[];
          value?: bigint;
        };
        
        writeContract({
          address: callData.address as `0x${string}`,
          abi: callData.abi,
          functionName: callData.functionName,
          args: callData.args || [],
          ...(callData.value && callData.value > BigInt(0) ? { value: callData.value } : {}),
        }, {
          onSuccess: (hash) => {
            fractionalizationTransaction.startTransaction(hash);
          },
          onError: (error) => {
            fractionalizationTransaction.setTransactionError(error.message);
          }
        });
      } else {
        // Fallback for direct transaction hash
        if ('txHash' in fractionalizeRes.data) {
          fractionalizationTransaction.startTransaction(fractionalizeRes.data.txHash);
        } else {
          throw new Error('Invalid fractionalization response format');
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fractionalize asset';
      fractionalizationTransaction.setTransactionError(errorMessage);
    }
  };

  const totalValue = fractionalSupply && reservePrice 
    ? (parseFloat(fractionalSupply) * parseFloat(reservePrice)).toFixed(6)
    : '0';

  const isLoading = approvalTransaction.isLoading || fractionalizationTransaction.isLoading;

  return (
    <>
    <div className="max-w-4xl mx-auto p-3 sm:p-4 lg:p-6 bg-card rounded-lg border border-card-border">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Scissors className="w-5 sm:w-6 h-5 sm:h-6 text-accent" />
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Asset Fractionalization</h2>
      </div>

        {/* Wallet Connection Warning */}
        {!isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-yellow-800 text-sm">Please connect your wallet to fractionalize assets.</p>
          </div>
        )}

        {isConnected && (
          <div className="space-y-4 sm:space-y-6">
            {/* Asset Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Asset to Fractionalize</label>
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
                          setApprovalCompleted(false); // Reset approval when selecting new asset
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
                          <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded">
                            <Lock className="w-3 h-3 inline mr-1" />
                            Whole
                          </span>
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
                    <PieChart className="w-8 h-8 text-accent" />
                  </div>
          <div className="text-center sm:text-left w-full">
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-1">
                      {selectedAssetInfo.metadata?.name || `Asset #${selectedTokenId}`}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base mb-2">
                      Current Value: {formatAppraisalValue(selectedAssetInfo.appraisalValue)} ETH
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="flex items-center gap-1 text-xs sm:text-sm bg-blue-500/20 text-blue-500 px-2 py-1 rounded">
                  <Lock className="w-3 h-3" />
                  Whole Asset
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getAssetTypeDisplay(selectedAssetInfo.assetType)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {selectedAssetInfo.physicalLocation}
                      </span>
                      {selectedAssetInfo.isAuthenticated && (
                        <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                          <Shield className="w-3 h-3" />
                          Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
            )}

            {selectedTokenId && (
              <>
                {/* How It Works */}
          <div className="bg-accent/10 border border-accent/20 rounded-md p-3 sm:p-4">
            <h3 className="font-semibold text-accent mb-2 text-sm sm:text-base">How Fractionalization Works</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your NFT will be locked in a vault contract and ERC-20 tokens representing fractional ownership will be minted. 
              Token holders can trade their shares freely. To unlock the original NFT, all fractions must be redeemed.
            </p>
          </div>

                {/* Fractionalization Parameters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Number of Fractions</label>
              <input
                type="number"
                      value={fractionalSupply}
                      onChange={(e) => setFractionalSupply(e.target.value)}
                className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
                placeholder="1000"
                min="100"
                max="1000000"
                      disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: 1,000 - 100,000 tokens
              </p>
            </div>

            <div>
                    <label className="block text-sm font-medium mb-2">Reserve Price per Fraction (ETH)</label>
              <input
                type="number"
                      step="0.000001"
                      value={reservePrice}
                      onChange={(e) => setReservePrice(e.target.value)}
                className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
                      placeholder="0.001"
                      disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                      Total value: {totalValue} ETH
              </p>
            </div>
          </div>

                {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-background rounded-lg p-3 sm:p-4 border border-card-border">
              <PieChart className="w-6 sm:w-8 h-6 sm:h-8 text-accent mb-2" />
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Increased Liquidity</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Enable partial ownership and easier trading of high-value assets
              </p>
            </div>
            <div className="bg-background rounded-lg p-3 sm:p-4 border border-card-border">
              <Share2 className="w-6 sm:w-8 h-6 sm:h-8 text-accent mb-2" />
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Broader Access</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Allow multiple investors to own portions of premium assets
              </p>
            </div>
            <div className="bg-background rounded-lg p-3 sm:p-4 border border-card-border sm:col-span-2 lg:col-span-1">
              <Lock className="w-6 sm:w-8 h-6 sm:h-8 text-accent mb-2" />
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Secure Custody</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Original NFT locked safely in smart contract vault
              </p>
            </div>
          </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {!approvalCompleted ? (
                    <button
                      onClick={handleApproveAsset}
                      disabled={isLoading || !selectedTokenId}
                      className="w-full bg-blue-500 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm sm:text-base"
                    >
                      {approvalTransaction.isLoading ? 'Approving Asset...' : 'Step 1: Approve Asset'}
                    </button>
                  ) : (
          <button
            onClick={handleFractionalize}
                      disabled={isLoading || !fractionalSupply || !reservePrice}
            className="w-full bg-accent text-accent-foreground font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 text-sm sm:text-base"
          >
                      {fractionalizationTransaction.isLoading ? 'Fractionalizing Asset...' : 'Step 2: Fractionalize Asset'}
            </button>
                  )}

                  {approvalCompleted && (
                    <div className="text-center">
                      <p className="text-sm text-green-600 mb-2">✓ Asset approved for fractionalization</p>
            </div>
          )}
        </div>
              </>
      )}

      {/* Chainlink Integration Notice */}
            <div className="bg-accent/10 border border-accent/20 rounded-md p-3 sm:p-4">
        <h3 className="font-semibold text-accent mb-2 text-sm sm:text-base">Powered by Chainlink</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Fractionalization uses Chainlink Proof of Reserve to ensure the original NFT remains securely locked, 
          and Chainlink Automation handles dividend distributions to fraction holders.
        </p>
      </div>
    </div>
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
        isOpen={fractionalizationTransaction.isModalOpen}
        onClose={fractionalizationTransaction.closeModal}
        status={fractionalizationTransaction.status}
        hash={fractionalizationTransaction.transactionHash}
        title={fractionalizationTransaction.title}
        description={fractionalizationTransaction.description}
        error={fractionalizationTransaction.error}
        confirmations={fractionalizationTransaction.confirmations}
        requiredConfirmations={fractionalizationTransaction.requiredConfirmations}
      />
    </>
  );
} 