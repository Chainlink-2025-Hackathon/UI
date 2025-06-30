'use client';

import { useState } from 'react';
import AuctionInterface from '@/components/auctions/AuctionInterface';
import { Gavel } from 'lucide-react';

export default function AuctionPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Sample auction data
  const sampleAuction = {
    id: '1',
    assetId: '3',
    assetTitle: 'Rare Diamond Collection',
    assetImage: '/api/placeholder/400/300',
    auctionType: 'english' as const,
    status: 'active' as const,
    liquidationType: 'loan_default' as const,
    startingPrice: '50.0',
    currentPrice: '75.5',
    reservePrice: '80.0',
    minimumBid: '76.0',
    bidIncrement: '0.5',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    duration: 86400,
    timeRemaining: 3600,
    totalBids: 15,
    totalBidders: 8,
    highestBid: '75.5',
    highestBidder: '0x123...',
    userBid: '70.0',
    userIsHighest: false
  };

  const handlePlaceBid = (bidAmount: string) => {
    setIsLoading(true);
    console.log('Placing bid:', bidAmount);
    setTimeout(() => {
      setIsLoading(false);
      alert('Bid placed successfully! (Demo)');
    }, 1500);
  };

  const handleWithdrawBid = () => {
    console.log('Withdrawing bid');
    alert('Bid withdrawn! (Demo)');
  };

  const handleClaimAsset = () => {
    setIsLoading(true);
    console.log('Claiming asset');
    setTimeout(() => {
      setIsLoading(false);
      alert('Asset claimed successfully! (Demo)');
    }, 1500);
  };

  return (
    <>
      {/* Feature Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Gavel className="w-7 h-7 text-red-500" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Auction System</h1>
            <p className="text-muted-foreground">Auction assets with automated bidding</p>
          </div>
        </div>
      </div>

      {/* Feature Content */}
      <div className="max-w-6xl">
        <AuctionInterface 
          auction={sampleAuction}
          onPlaceBid={handlePlaceBid}
          onWithdrawBid={handleWithdrawBid}
          onClaimAsset={handleClaimAsset}
          isLoading={isLoading}
        />
      </div>
    </>
  );
} 