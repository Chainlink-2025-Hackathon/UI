'use client';

import { useState } from 'react';
import LaunchpadInterface from '@/components/marketplace/LaunchpadInterface';
import { Rocket } from 'lucide-react';

interface CreateListingData {
  assetId: string;
  tokensToSell: number;
  pricePerToken: string;
  saleType: 'fixed' | 'dutch' | 'whitelist';
  startTime: string;
  endTime: string;
  minPurchase: string;
  maxPurchase?: string;
  description: string;
}

export default function LaunchpadPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Sample launchpad data
  const sampleLaunchpadListings = [
    {
      id: '1',
      assetId: 'asset1',
      title: 'Premium Dubai Real Estate Portfolio',
      description: 'Exclusive fractional ownership of luxury properties in Dubai Marina and Downtown Dubai',
      image: '/api/placeholder/400/300',
      assetType: 'real-estate' as const,
      tokenType: 'fractionalized' as const,
      totalSupply: 100000,
      availableTokens: 75000,
      pricePerToken: '0.025',
      totalRaised: '625.5',
      targetAmount: '2500.0',
      minPurchase: '10',
      maxPurchase: '5000',
      saleType: 'fixed' as const,
      status: 'live' as const,
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      participantCount: 234,
      progress: 25,
      creator: {
        name: 'Dubai Properties LLC',
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      isVerified: true,
      isFeatured: true,
      hasAudit: true
    },
    {
      id: '2',
      assetId: 'asset2',
      title: 'Rare Vintage Wine Collection',
      description: 'Bordeaux first growth wines from exceptional vintages, professionally stored and authenticated',
      image: '/api/placeholder/400/300',
      assetType: 'commodity' as const,
      tokenType: 'fractionalized' as const,
      totalSupply: 10000,
      availableTokens: 8500,
      pricePerToken: '0.15',
      totalRaised: '225.0',
      targetAmount: '1500.0',
      minPurchase: '5',
      saleType: 'fixed' as const,
      status: 'live' as const,
      startTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      participantCount: 89,
      progress: 15,
      creator: {
        name: 'Vineyard Masters',
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      isVerified: true,
      isFeatured: false,
      hasAudit: true
    },
    {
      id: '3',
      assetId: 'asset3',
      title: 'Contemporary Art Masterpiece',
      description: 'Banksy original artwork with full provenance and authentication certificates',
      image: '/api/placeholder/400/300',
      assetType: 'art' as const,
      tokenType: 'nft' as const,
      availableTokens: 1,
      pricePerToken: '45.0',
      totalRaised: '0.0',
      targetAmount: '45.0',
      minPurchase: '1',
      saleType: 'fixed' as const,
      status: 'upcoming' as const,
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      participantCount: 0,
      progress: 0,
      creator: {
        name: 'Art Collective NYC',
        avatar: '/api/placeholder/40/40',
        verified: false
      },
      isVerified: false,
      isFeatured: false,
      hasAudit: false
    }
  ];

  const sampleUserAssets = [
    {
      id: '1',
      title: 'Swiss Gold Bars',
      image: '/api/placeholder/200/150',
      tokenType: 'fractionalized' as const,
      totalTokens: 50000,
      ownedTokens: 12500,
      currentValue: '125.5'
    },
    {
      id: '2',
      title: 'Monet Water Lilies',
      image: '/api/placeholder/200/150',
      tokenType: 'nft' as const,
      ownedTokens: 1,
      currentValue: '85.2'
    },
    {
      id: '3',
      title: 'London Property Shares',
      image: '/api/placeholder/200/150',
      tokenType: 'fractionalized' as const,
      totalTokens: 25000,
      ownedTokens: 5000,
      currentValue: '75.8'
    }
  ];

  const handleCreateListing = (listingData: CreateListingData) => {
    setIsLoading(true);
    console.log('Creating listing:', listingData);
    setTimeout(() => {
      setIsLoading(false);
      alert('Listing created successfully! (Demo)');
    }, 2000);
  };

  const handlePurchaseTokens = (listingId: string, amount: string) => {
    setIsLoading(true);
    console.log('Purchasing tokens:', { listingId, amount });
    setTimeout(() => {
      setIsLoading(false);
      alert(`Purchased ${amount} tokens successfully! (Demo)`);
    }, 1500);
  };

  const handleWithdrawTokens = (listingId: string) => {
    console.log('Withdrawing tokens:', listingId);
    alert('Tokens withdrawn! (Demo)');
  };

  return (
    <>
      {/* Feature Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Rocket className="w-7 h-7 text-indigo-500" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Asset Launchpad</h1>
            <p className="text-muted-foreground">Launch and invest in tokenized assets</p>
          </div>
        </div>
      </div>

      {/* Feature Content */}
      <div className="max-w-6xl">
        <LaunchpadInterface 
          listings={sampleLaunchpadListings}
          userAssets={sampleUserAssets}
          onCreateListing={handleCreateListing}
          onPurchaseTokens={handlePurchaseTokens}
          onWithdrawTokens={handleWithdrawTokens}
          isLoading={isLoading}
        />
      </div>
    </>
  );
} 