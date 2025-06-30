'use client';

import { useState } from 'react';
import { FileText, Shield, MapPin } from 'lucide-react';
import { useWriteContract, type BaseError } from 'wagmi';
import { useMintAsset } from '@/hooks/useApi';
import { useWallet } from '@/hooks/useWallet';
import { useTransaction } from '@/hooks/useTransaction';
import { TransactionModal } from '@/components/wallet';
import { MintAssetRequest } from '@/types/api';

interface AssetMintingFormProps {
  onMint?: (success: boolean) => void;
}

interface AssetData {
  assetType: 'art' | 'commodity' | 'real-estate';
  physicalLocation: string;
  appraisalValueUSD: string;
  custodian: string;
  authenticityCertHash: string;
  // Commented out metadata fields for now
  // title: string;
  // description: string;
  // authenticityCertificate: File | null;
  // assetImages: File[];
  // metadata: Record<string, string>;
}

export default function AssetMintingForm({ onMint }: AssetMintingFormProps) {
  const [formData, setFormData] = useState<AssetData>({
    assetType: 'art',
    physicalLocation: '',
    appraisalValueUSD: '',
    custodian: '',
    authenticityCertHash: '',
    // Commented out for now
    // title: '',
    // description: '',
    // authenticityCertificate: null,
    // assetImages: [],
    // metadata: {}
  });
  const [error, setError] = useState<string | null>(null);

  // Wallet integration
  const { address, isConnected } = useWallet();

  // Transaction management
  const transaction = useTransaction({
    title: 'Mint Asset NFT',
    description: 'Minting your real-world asset as an NFT on the blockchain',
    onSuccess: () => {
      onMint?.(true);
    },
    onError: (errorMessage) => {
      console.error('Transaction error:', errorMessage);
    }
  });

  const mintAsset = useMintAsset();

  // Wagmi hooks for contract interaction
  const { 
    error: contractError,
    writeContract 
  } = useWriteContract();

  const isLoading = mintAsset.isPending || transaction.isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }
    
    try {
      // Step 1: Set transaction to pending state
      transaction.setTransactionPending();

      // Step 2: Get contract call data from API with proper data structure
      const mintReq: MintAssetRequest = {
        to: address,
        assetType: formData.assetType,
        physicalLocation: formData.physicalLocation,
        appraisalValueUSD: parseFloat(formData.appraisalValueUSD),
        custodian: formData.custodian,
        authenticityCertHash: formData.authenticityCertHash,
        metadataURI: 'https://hardcoded-metadata-uri.com/metadata.json', // Hardcoded for now
      };
      
      const mintRes = await mintAsset.mutateAsync(mintReq);
      if (!mintRes.data) throw new Error('Failed to get contract call data');

      // Step 3: Execute the contract call using Wagmi
      const contractCallData = mintRes.contractCall || mintRes.data;
      
      if (contractCallData && typeof contractCallData === 'object' && 'address' in contractCallData) {
        const callData = contractCallData as {
          address: string;
          abi: readonly unknown[];
          functionName: string;
          args?: readonly unknown[];
          value?: bigint;
        };
        
        const writeParams: Parameters<typeof writeContract>[0] = {
          address: callData.address as `0x${string}`,
          abi: callData.abi,
          functionName: callData.functionName,
          args: callData.args || [],
        };

        if (callData.value && callData.value > BigInt(0)) {
          Object.assign(writeParams, { value: callData.value });
        }

        // Execute the contract call
        writeContract(writeParams, {
          onSuccess: (hash) => {
            transaction.startTransaction(hash);
          },
          onError: (error) => {
            transaction.setTransactionError(error.message);
          }
        });
      } else {
        throw new Error('Invalid contract call data received from API');
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mint asset';
      const apiError = err as { response?: { data?: { message?: string } } };
      const finalError = apiError?.response?.data?.message || errorMessage;
      
      setError(finalError);
      transaction.setTransactionError(finalError);
      console.error('Minting error:', err);
    }
  };

  // Handle contract errors
  if (contractError && !error) {
    setError(`Contract Error: ${(contractError as BaseError).shortMessage || contractError.message}`);
  }

  return (
    <>
    <div className="max-w-4xl mx-auto p-3 sm:p-4 lg:p-6 bg-card rounded-lg border border-card-border">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Shield className="w-5 sm:w-6 h-5 sm:h-6 text-accent" />
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Tokenize Real World Asset</h2>
      </div>

        {/* Wallet Connection Warning */}
        {!isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-yellow-800 text-sm">Please connect your wallet to mint an asset NFT.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Asset Type and Physical Location */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Asset Type</label>
            <select
              value={formData.assetType}
              onChange={(e) => setFormData(prev => ({ ...prev, assetType: e.target.value as AssetData['assetType'] }))}
              className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
                required
            >
              <option value="art">Art & Collectibles</option>
              <option value="commodity">Commodities</option>
              <option value="real-estate">Real Estate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
                Physical Location
            </label>
            <input
              type="text"
                value={formData.physicalLocation}
                onChange={(e) => setFormData(prev => ({ ...prev, physicalLocation: e.target.value }))}
              className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
              placeholder="New York, NY, USA"
              required
            />
          </div>
        </div>

          {/* Appraisal Value and Custodian */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Appraisal Value (USD)</label>
              <input
                type="number"
                value={formData.appraisalValueUSD}
                onChange={(e) => setFormData(prev => ({ ...prev, appraisalValueUSD: e.target.value }))}
                className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
                placeholder="100000"
                min="0"
                step="0.01"
                required
              />
            </div>

        <div>
              <label className="block text-sm font-medium mb-2">Custodian</label>
          <input
            type="text"
                value={formData.custodian}
                onChange={(e) => setFormData(prev => ({ ...prev, custodian: e.target.value }))}
            className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
            placeholder="e.g., Sotheby's Vault, Swiss Bank, Secure Storage Facility"
            required
          />
            </div>
        </div>

          {/* Authenticity Certificate Hash */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Authenticity Certificate Hash
            </label>
            <input
              type="text"
              value={formData.authenticityCertHash}
              onChange={(e) => setFormData(prev => ({ ...prev, authenticityCertHash: e.target.value }))}
              className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
              placeholder="0x... (Hash of the authenticity certificate)"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">Hash of the authenticity certificate document</p>
          </div>

          {/* Hardcoded Metadata Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 sm:p-4">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Metadata Configuration</h3>
            <p className="text-xs sm:text-sm text-blue-700">
              Metadata URI is currently hardcoded to: <code className="bg-blue-100 px-1 rounded">https://hardcoded-metadata-uri.com/metadata.json</code>
            </p>
            <p className="text-xs text-blue-600 mt-1">File upload and metadata creation will be implemented in the next phase.</p>
        </div>

        {/* Chainlink Integration Notice */}
        <div className="bg-accent/10 border border-accent/20 rounded-md p-3 sm:p-4">
          <h3 className="font-semibold text-accent mb-2 text-sm sm:text-base">Chainlink Integration</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Your asset will be verified using Chainlink Functions for authenticity checks and Proof of Reserve for custody verification. 
            The metadata will be stored on IPFS and linked to your NFT.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
            disabled={isLoading || !isConnected}
          className="w-full bg-accent text-accent-foreground font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 text-sm sm:text-base"
        >
            {isLoading ? 'Processing...' : !isConnected ? 'Connect Wallet to Mint' : 'Mint Asset NFT'}
        </button>

          {/* Connected Wallet Info */}
          {isConnected && address && (
            <div className="text-sm text-muted-foreground">
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          )}
          
          {/* Error Messages */}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </form>
    </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={transaction.isModalOpen}
        onClose={transaction.closeModal}
        status={transaction.status}
        hash={transaction.transactionHash}
        title={transaction.title}
        description={transaction.description}
        error={transaction.error}
      />
    </>
  );
} 