'use client';

import { useState, useMemo } from 'react';
import { Rocket, Star, TrendingUp, Clock, Users, Tag, Zap } from 'lucide-react';
import Image from 'next/image';

interface LaunchpadListing {
  id: string;
  assetId: string;
  title: string;
  description: string;
  image: string;
  
  // Asset details
  assetType: 'art' | 'commodity' | 'real-estate';
  tokenType: 'nft' | 'fractionalized';
  totalSupply?: number; // For fractionalized assets
  availableTokens: number;
  
  // Pricing
  pricePerToken: string;
  totalRaised: string;
  targetAmount: string;
  minPurchase: string;
  maxPurchase?: string;
  
  // Sale details
  saleType: 'fixed' | 'dutch' | 'whitelist';
  status: 'upcoming' | 'live' | 'sold-out' | 'ended';
  startTime: string;
  endTime: string;
  
  // Progress
  participantCount: number;
  progress: number; // percentage
  
  // Creator info
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  
  // Features
  isVerified: boolean;
  isFeatured: boolean;
  hasAudit: boolean;
}

interface LaunchpadInterfaceProps {
  listings?: LaunchpadListing[];
  userAssets?: UserAsset[];
  onCreateListing?: (listingData: CreateListingData) => void;
  onPurchaseTokens?: (listingId: string, amount: string) => void;
  isLoading?: boolean;
}

interface UserAsset {
  id: string;
  title: string;
  image: string;
  tokenType: 'nft' | 'fractionalized';
  totalTokens?: number;
  ownedTokens: number;
  currentValue: string;
}

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

export default function LaunchpadInterface({
  listings = [],
  userAssets = [],
  onCreateListing,
  onPurchaseTokens,
  isLoading = false
}: LaunchpadInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'my-listings'>('browse');
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [listingForm, setListingForm] = useState<Partial<CreateListingData>>({
    saleType: 'fixed'
  });
  const [purchaseAmount, setPurchaseAmount] = useState<Record<string, string>>({});
  
  // Filter states
  const [filters, setFilters] = useState({
    category: 'all',
    tokenType: 'all',
    status: 'all'
  });

  // Filtered listings based on current filter state
  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      // Category filter
      if (filters.category !== 'all' && listing.assetType !== filters.category) {
        return false;
      }
      
      // Token type filter
      if (filters.tokenType !== 'all' && listing.tokenType !== filters.tokenType) {
        return false;
      }
      
      // Status filter
      if (filters.status !== 'all' && listing.status !== filters.status) {
        return false;
      }
      
      return true;
    });
  }, [listings, filters]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleCreateListing = () => {
    if (!onCreateListing || !selectedAsset) return;
    
    onCreateListing({
      assetId: selectedAsset,
      tokensToSell: Number(listingForm.tokensToSell || 0),
      pricePerToken: listingForm.pricePerToken || '0',
      saleType: listingForm.saleType || 'fixed',
      startTime: listingForm.startTime || '',
      endTime: listingForm.endTime || '',
      minPurchase: listingForm.minPurchase || '1',
      maxPurchase: listingForm.maxPurchase,
      description: listingForm.description || ''
    });
  };

  const handlePurchase = (listingId: string) => {
    if (!onPurchaseTokens) return;
    const amount = purchaseAmount[listingId] || '0';
    onPurchaseTokens(listingId, amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-500 bg-green-500/10';
      case 'upcoming': return 'text-blue-500 bg-blue-500/10';
      case 'sold-out': return 'text-orange-500 bg-orange-500/10';
      case 'ended': return 'text-gray-500 bg-gray-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
        <Rocket className="w-5 sm:w-6 lg:w-8 h-5 sm:h-6 lg:h-8 text-accent" />
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">RWA Launchpad</h1>
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Discover and invest in tokenized real-world assets</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-3 sm:flex gap-1 sm:gap-2 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
        {[
          { id: 'browse', name: 'Browse Listings', shortName: 'Browse', icon: TrendingUp },
          { id: 'create', name: 'Create Listing', shortName: 'Create', icon: Tag },
          { id: 'my-listings', name: 'My Listings', shortName: 'My Listings', icon: Users }
        ].map(({ id, name, shortName, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as 'browse' | 'create' | 'my-listings')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg font-medium transition-all text-xs sm:text-sm lg:text-base ${
              activeTab === id
                ? 'bg-accent text-accent-foreground'
                : 'bg-card text-muted-foreground hover:text-foreground hover:bg-card/80'
            }`}
          >
            <Icon className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="sm:hidden text-xs leading-none">{shortName}</span>
            <span className="hidden sm:inline">{name}</span>
          </button>
        ))}
      </div>

      {/* Browse Listings Tab */}
      {activeTab === 'browse' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Filter Bar */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4 p-3 sm:p-4 bg-card rounded-lg border border-card-border">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              <select 
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 border border-card-border rounded-md bg-background text-foreground text-xs sm:text-sm"
              >
                <option value="all">All Categories</option>
                <option value="art">Art</option>
                <option value="real-estate">Real Estate</option>
                <option value="commodity">Commodities</option>
              </select>
              <select 
                value={filters.tokenType}
                onChange={(e) => handleFilterChange('tokenType', e.target.value)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 border border-card-border rounded-md bg-background text-foreground text-xs sm:text-sm"
              >
                <option value="all">All Types</option>
                <option value="nft">NFT</option>
                <option value="fractionalized">Fractionalized</option>
              </select>
              <select 
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 border border-card-border rounded-md bg-background text-foreground text-xs sm:text-sm col-span-2 sm:col-span-1"
              >
                <option value="all">All Status</option>
                <option value="live">Live</option>
                <option value="upcoming">Upcoming</option>
                <option value="ended">Ended</option>
                <option value="sold-out">Sold Out</option>
              </select>
            </div>
            
            {/* Filter Results Info */}
            <div className="text-center sm:text-left sm:ml-auto text-xs sm:text-sm text-muted-foreground">
              {filteredListings.length} of {listings.length} listings
            </div>
          </div>

          {/* No Results Message */}
          {filteredListings.length === 0 && (
            <div className="text-center py-8 sm:py-12 bg-card rounded-lg border border-card-border">
              <div className="text-muted-foreground mb-4">
                <TrendingUp className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-2 opacity-50" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">No listings found</h3>
                <p className="text-sm">Try adjusting your filters to see more results</p>
              </div>
              <button
                onClick={() => setFilters({ category: 'all', tokenType: 'all', status: 'all' })}
                className="bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Listings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-card rounded-lg border border-card-border overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative">
                  <Image 
                    src={listing.image} 
                    alt={listing.title}
                    width={400}
                    height={200}
                    className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {listing.isFeatured && (
                      <div className="bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                    {listing.isVerified && (
                      <div className="bg-green-500 text-white px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star className="w-2.5 h-2.5" />
                        <span className="hidden sm:inline">Verified</span>
                      </div>
                    )}
                  </div>
                  <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </div>
                  
                  {/* Asset Type Badge */}
                  <div className="absolute bottom-2 left-2">
                    <div className="bg-black/50 text-white px-1.5 py-0.5 rounded-full text-xs font-medium">
                      {listing.assetType === 'real-estate' ? 'Real Estate' : 
                       listing.assetType.charAt(0).toUpperCase() + listing.assetType.slice(1)}
                    </div>
                  </div>
                  
                  {/* Token Type Badge */}
                  <div className="absolute bottom-2 right-2">
                    <div className="bg-black/50 text-white px-1.5 py-0.5 rounded-full text-xs font-medium">
                      {listing.tokenType === 'fractionalized' ? 'Frac' : 'NFT'}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-1 line-clamp-1">{listing.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
                  </div>

                  {/* Creator */}
                  <div className="flex items-center gap-2">
                    <Image 
                      src={listing.creator.avatar} 
                      alt={listing.creator.name}
                      width={24}
                      height={24}
                      className="w-4 sm:w-6 h-4 sm:h-6 rounded-full"
                    />
                    <span className="text-xs sm:text-sm font-medium truncate">{listing.creator.name}</span>
                    {listing.creator.verified && (
                      <Star className="w-3 sm:w-4 h-3 sm:h-4 text-blue-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{listing.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
                      <div 
                        className="bg-accent h-1.5 sm:h-2 rounded-full transition-all"
                        style={{ width: `${listing.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-muted-foreground">{listing.totalRaised} ETH</span>
                      <span className="text-muted-foreground">{listing.participantCount} participants</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-2 gap-3 text-center sm:text-left">
                    <div>
                      <p className="text-xs text-muted-foreground">Price per token</p>
                      <p className="font-semibold text-accent text-sm">{listing.pricePerToken} ETH</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Available</p>
                      <p className="font-semibold text-sm">{listing.availableTokens.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Time remaining */}
                  {listing.status === 'live' && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground justify-center sm:justify-start">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeRemaining(listing.endTime)} remaining</span>
                    </div>
                  )}

                  {/* Purchase Interface */}
                  {listing.status === 'live' && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={purchaseAmount[listing.id] || ''}
                          onChange={(e) => setPurchaseAmount({
                            ...purchaseAmount,
                            [listing.id]: e.target.value
                          })}
                          placeholder={`Min: ${listing.minPurchase}`}
                          className="flex-1 px-2 py-1.5 border border-card-border rounded-md bg-background text-foreground text-xs"
                        />
                        <button
                          onClick={() => handlePurchase(listing.id)}
                          disabled={isLoading || !purchaseAmount[listing.id]}
                          className="bg-accent text-accent-foreground px-3 py-1.5 rounded-md text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          Buy
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Total: {((parseFloat(purchaseAmount[listing.id] || '0')) * parseFloat(listing.pricePerToken)).toFixed(3)} ETH
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Listing Tab */}
      {activeTab === 'create' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg border border-card-border p-4 sm:p-6 space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold">Create New Listing</h2>

            {/* Asset Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Asset</label>
              <select 
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
              >
                <option value="">Choose an asset...</option>
                {userAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.title} ({asset.tokenType === 'fractionalized' ? `${asset.ownedTokens}/${asset.totalTokens} tokens` : '1 NFT'})
                  </option>
                ))}
              </select>
            </div>

            {selectedAsset && (
              <>
                {/* Tokens to Sell */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tokens to Sell</label>
                  <input
                    type="number"
                    value={listingForm.tokensToSell || ''}
                    onChange={(e) => setListingForm({...listingForm, tokensToSell: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
                    max={userAssets.find(a => a.id === selectedAsset)?.ownedTokens}
                  />
                </div>

                {/* Price per Token */}
                <div>
                  <label className="block text-sm font-medium mb-2">Price per Token (ETH)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={listingForm.pricePerToken || ''}
                    onChange={(e) => setListingForm({...listingForm, pricePerToken: e.target.value})}
                    className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
                  />
                </div>

                {/* Sale Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Sale Type</label>
                  <select 
                    value={listingForm.saleType}
                    onChange={(e) => setListingForm({...listingForm, saleType: e.target.value as 'fixed' | 'dutch' | 'whitelist'})}
                    className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="dutch">Dutch Auction</option>
                    <option value="whitelist">Whitelist Sale</option>
                  </select>
                </div>

                {/* Time Period */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Time</label>
                    <input
                      type="datetime-local"
                      value={listingForm.startTime || ''}
                      onChange={(e) => setListingForm({...listingForm, startTime: e.target.value})}
                      className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Time</label>
                    <input
                      type="datetime-local"
                      value={listingForm.endTime || ''}
                      onChange={(e) => setListingForm({...listingForm, endTime: e.target.value})}
                      className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
                    />
                  </div>
                </div>

                {/* Purchase Limits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Min Purchase</label>
                    <input
                      type="number"
                      value={listingForm.minPurchase || ''}
                      onChange={(e) => setListingForm({...listingForm, minPurchase: e.target.value})}
                      className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Purchase (Optional)</label>
                    <input
                      type="number"
                      value={listingForm.maxPurchase || ''}
                      onChange={(e) => setListingForm({...listingForm, maxPurchase: e.target.value})}
                      className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={listingForm.description || ''}
                    onChange={(e) => setListingForm({...listingForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
                    placeholder="Describe your asset listing..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleCreateListing}
                  disabled={isLoading}
                  className="w-full bg-accent text-accent-foreground font-medium py-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                >
                  {isLoading ? 'Creating Listing...' : 'Create Listing'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Chainlink Integration Notice */}
      <div className="mt-6 sm:mt-8 bg-accent/10 border border-accent/20 rounded-md p-3 sm:p-4">
        <h3 className="font-semibold text-accent mb-2 flex items-center gap-2 text-sm sm:text-base">
          <Zap className="w-4 sm:w-5 h-4 sm:h-5" />
          Powered by Chainlink
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="space-y-1">
            <p>• <strong>Price Feeds:</strong> Real-time asset valuation</p>
            <p>• <strong>Functions:</strong> External data verification</p>
          </div>
          <div className="space-y-1">
            <p>• <strong>Automation:</strong> Automated listing management</p>
            <p>• <strong>CCIP:</strong> Cross-chain asset trading</p>
          </div>
        </div>
      </div>
    </div>
  );
} 