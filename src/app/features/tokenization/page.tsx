'use client';

import { useState } from 'react';
import AssetMintingForm from '@/components/tokenization/AssetMintingForm';
import { Coins } from 'lucide-react';

// Import types
interface AssetData {
  title: string;
  description: string;
  assetType: 'art' | 'commodity' | 'real-estate';
  appraisalValue: string;
  custodianInfo: string;
  authenticityCertificate: File | null;
  assetImages: File[];
  location: string;
  metadata: Record<string, string>;
}

export default function TokenizationPage() {
  const [mintStatus, setMintStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleMintComplete = (success: boolean) => {
    setMintStatus(success ? 'success' : 'error');
    
    // Clear status after 5 seconds
    setTimeout(() => {
      setMintStatus('idle');
    }, 5000);
  };

  return (
    <>
      {/* Feature Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Coins className="w-7 h-7 text-blue-500" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Asset Tokenization</h1>
            <p className="text-muted-foreground">Convert real-world assets into blockchain tokens</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {mintStatus === 'success' && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-800 font-medium">✅ Asset minted successfully!</p>
          <p className="text-green-700 text-sm mt-1">Your real-world asset has been tokenized on the blockchain.</p>
        </div>
      )}

      {mintStatus === 'error' && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 font-medium">❌ Minting failed</p>
          <p className="text-red-700 text-sm mt-1">Please try again or check the transaction details.</p>
        </div>
      )}

      {/* Feature Content */}
      <div className="max-w-6xl">
        <AssetMintingForm 
          onMint={handleMintComplete}
        />
      </div>
    </>
  );
} 