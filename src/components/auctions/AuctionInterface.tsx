'use client';

import { useState, useEffect } from 'react';
import { Gavel, Clock, TrendingUp, TrendingDown, AlertCircle, Users } from 'lucide-react';

interface AuctionInterfaceProps {
  auction: AuctionData;
  onPlaceBid: (bidAmount: string) => void;
  onWithdrawBid: () => void;
  onClaimAsset: () => void;
  isLoading?: boolean;
}

interface AuctionData {
  id: string;
  assetId: string;
  assetTitle: string;
  assetImage: string;
  
  // Auction details
  auctionType: 'english' | 'dutch';
  status: 'active' | 'ended' | 'cancelled';
  liquidationType?: 'loan_default' | 'forced_sale' | 'market_sale';
  
  // Pricing
  startingPrice: string;
  currentPrice: string;
  reservePrice?: string;
  minimumBid: string;
  bidIncrement: string;
  
  // Timing
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  timeRemaining: number;
  
  // Participants
  totalBids: number;
  totalBidders: number;
  highestBid?: string;
  highestBidder?: string;
  userBid?: string;
  userIsHighest: boolean;
  
  // Dutch auction specific
  priceDecrement?: string;
  decrementInterval?: number; // in seconds
}

export default function AuctionInterface({ 
  auction, 
  onPlaceBid, 
  onWithdrawBid, 
  onClaimAsset,
  isLoading = false 
}: AuctionInterfaceProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState(auction.timeRemaining);

  // Countdown timer
  useEffect(() => {
    if (auction.status !== 'active') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.status]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getMinimumBid = () => {
    if (auction.auctionType === 'dutch') {
      return auction.currentPrice;
    }
    
    const currentBid = parseFloat(auction.highestBid || '0');
    const increment = parseFloat(auction.bidIncrement);
    return (currentBid + increment).toString();
  };

  const canBid = () => {
    if (auction.status !== 'active') return false;
    if (timeLeft <= 0) return false;
    if (auction.userIsHighest) return false;
    
    const bidValue = parseFloat(bidAmount);
    const minBid = parseFloat(getMinimumBid());
    
    return bidValue >= minBid;
  };

  const getAuctionStatusColor = () => {
    switch (auction.status) {
      case 'active': return 'text-green-500';
      case 'ended': return 'text-gray-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const isLiquidationAuction = auction.liquidationType === 'loan_default';

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 lg:p-6 bg-card rounded-lg border border-card-border">
      {/* Header */}
      <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Gavel className="w-5 sm:w-6 h-5 sm:h-6 text-accent mt-1" />
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
            {auction.auctionType === 'dutch' ? 'Dutch Auction' : 'English Auction'}
          </h2>
          {isLiquidationAuction && (
            <div className="flex items-center gap-2 mt-1">
              <AlertCircle className="w-3 sm:w-4 h-3 sm:h-4 text-orange-500" />
              <span className="text-xs sm:text-sm text-orange-500">Liquidation Auction</span>
            </div>
          )}
        </div>
      </div>

      {/* Asset Preview - Mobile Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        <div>
          <img 
            src={auction.assetImage} 
            alt={auction.assetTitle}
            className="w-full h-48 sm:h-64 lg:h-80 rounded-lg object-cover"
          />
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2">{auction.assetTitle}</h3>
            <div className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getAuctionStatusColor()} bg-current/10`}>
              <div className="w-2 h-2 rounded-full bg-current"></div>
              {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
            </div>
          </div>

          {/* Pricing Information - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-background rounded-lg p-3 sm:p-4 border border-card-border">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {auction.auctionType === 'dutch' ? 'Current Price' : 'Highest Bid'}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-accent">{auction.currentPrice} ETH</p>
                {auction.auctionType === 'dutch' ? (
                  <TrendingDown className="w-4 sm:w-5 h-4 sm:h-5 text-red-500" />
                ) : (
                  <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            <div className="bg-background rounded-lg p-3 sm:p-4 border border-card-border">
              <p className="text-xs sm:text-sm text-muted-foreground">Time Remaining</p>
              <div className="flex items-center gap-2">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{formatTime(timeLeft)}</p>
                <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Auction Details - Mobile Optimized */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Starting Price</span>
              <span className="font-semibold">{auction.startingPrice} ETH</span>
            </div>
            {auction.reservePrice && (
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Reserve Price</span>
                <span className="font-semibold">{auction.reservePrice} ETH</span>
              </div>
            )}
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Total Bids</span>
              <span className="font-semibold flex items-center gap-1">
                <Users className="w-3 sm:w-4 h-3 sm:h-4" />
                {auction.totalBids} ({auction.totalBidders} bidders)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bidding Interface - Mobile Optimized */}
      {auction.status === 'active' && (
        <div className="bg-background rounded-lg p-3 sm:p-4 border border-card-border mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Place Bid</h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Bid Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
                  placeholder={getMinimumBid()}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum bid: {getMinimumBid()} ETH
                </p>
              </div>

              <div className="flex flex-col justify-end">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onPlaceBid(bidAmount)}
                    disabled={!canBid() || isLoading}
                    className="bg-accent text-accent-foreground font-medium py-2 px-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                  >
                    {isLoading ? 'Placing...' : 'Place Bid'}
                  </button>
                  
                  {auction.userBid && (
                    <button
                      onClick={onWithdrawBid}
                      disabled={isLoading || auction.userIsHighest}
                      className="bg-muted text-foreground font-medium py-2 px-3 rounded-md hover:bg-muted/80 transition-colors disabled:opacity-50 text-sm"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Bid Buttons - Mobile Optimized */}
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">Quick bid amounts:</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {[
                  getMinimumBid(),
                  (parseFloat(getMinimumBid()) + 0.1).toFixed(3),
                  (parseFloat(getMinimumBid()) + 0.25).toFixed(3),
                  (parseFloat(getMinimumBid()) + 0.5).toFixed(3)
                ].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBidAmount(amount)}
                    className="px-2 py-1.5 text-xs sm:text-sm bg-muted text-foreground rounded border hover:bg-muted/80 transition-colors"
                  >
                    {amount} ETH
                  </button>
                ))}
              </div>
            </div>

            {/* User's Current Bid Status */}
            {auction.userBid && (
              <div className={`p-3 rounded-md ${
                auction.userIsHighest 
                  ? 'bg-green-500/10 border border-green-500/20' 
                  : 'bg-yellow-500/10 border border-yellow-500/20'
              }`}>
                <p className={`text-sm font-medium ${
                  auction.userIsHighest ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {auction.userIsHighest 
                    ? '🎉 You have the highest bid!' 
                    : '⚠️ You have been outbid'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your bid: {auction.userBid} ETH
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auction Ended State */}
      {auction.status === 'ended' && (
        <div className="bg-background rounded-lg p-3 sm:p-4 border border-card-border mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3">Auction Ended</h3>
          
          {auction.userIsHighest ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-md p-3 sm:p-4">
              <p className="text-green-500 font-medium mb-2">🎉 Congratulations! You won the auction!</p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                Winning bid: {auction.highestBid} ETH
              </p>
              <button
                onClick={onClaimAsset}
                disabled={isLoading}
                className="w-full sm:w-auto bg-green-500 text-white font-medium py-2 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
              >
                {isLoading ? 'Claiming...' : 'Claim Asset'}
              </button>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-md p-3 sm:p-4">
              <p className="text-muted-foreground text-sm">
                Auction ended. Winning bid: {auction.highestBid} ETH
              </p>
              {auction.userBid && (
                <p className="text-xs text-muted-foreground mt-1">
                  Your bid: {auction.userBid} ETH
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bid History - Mobile Optimized */}
      <div className="bg-background rounded-lg p-3 sm:p-4 border border-card-border mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Activity</h3>
        <div className="space-y-2">
          {/* Mock recent bids - in real app this would come from props */}
          <div className="flex justify-between items-center py-2 border-b border-card-border last:border-b-0">
            <div>
              <p className="text-xs sm:text-sm font-medium">0x1234...5678</p>
              <p className="text-xs text-muted-foreground">2 minutes ago</p>
            </div>
            <p className="text-xs sm:text-sm font-semibold">{auction.currentPrice} ETH</p>
          </div>
          <div className="text-center py-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {auction.totalBids} total bids from {auction.totalBidders} unique bidders
            </p>
          </div>
        </div>
      </div>

      {/* Chainlink Integration Notice */}
      <div className="bg-accent/10 border border-accent/20 rounded-md p-3 sm:p-4">
        <h3 className="font-semibold text-accent mb-2 text-sm sm:text-base">Powered by Chainlink</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Auction timing and settlement powered by Chainlink Automation. Price discovery enhanced by Chainlink Price Feeds. 
          Cross-chain bidding enabled through Chainlink CCIP.
        </p>
      </div>
    </div>
  );
} 