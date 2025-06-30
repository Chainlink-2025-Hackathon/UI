'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AssetMintingForm from '@/components/tokenization/AssetMintingForm';
import FractionalizationInterface from '@/components/fractionalization/FractionalizationInterface';
import LendingInterface from '@/components/lending/LendingInterface';
import AuctionInterface from '@/components/auctions/AuctionInterface';
import LaunchpadInterface from '@/components/marketplace/LaunchpadInterface';

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

interface LoanData {
  collateralAmount: string;
  loanAmount: string;
  interestRate: string;
  duration: number;
  collateralType: 'nft' | 'fractions';
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

export default function DemoPage() {
  const [activeSection, setActiveSection] = useState('tokenization');
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for components
  const sampleAssetData = {
    id: '1',
    title: 'Vintage Picasso Painting',
    image: '/api/placeholder/400/300',
    currentValue: '2,500,000',
    isOwner: true,
    isFractionalized: false,
    totalFractions: 10000,
    ownedFractions: 2500
  };

  const sampleFractionalizedAsset = {
    ...sampleAssetData,
    isFractionalized: true,
    title: 'Gold Bar Collection'
  };

  const sampleLendingAsset = {
    id: '2',
    title: 'Manhattan Penthouse',
    image: '/api/placeholder/400/300',
    currentValue: '5,000,000',
    floorPrice: '4,200,000',
    isFractionalized: true,
    fractionBalance: 500
  };

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

  const handleMintAsset = (assetData: AssetData) => {
    setIsLoading(true);
    console.log('Minting asset:', assetData);
    setTimeout(() => {
      setIsLoading(false);
      alert('Asset minted successfully! (Demo)');
    }, 2000);
  };

  const handleFractionalize = (fractionCount: number, pricePerFraction: string) => {
    setIsLoading(true);
    console.log('Fractionalizing asset:', { fractionCount, pricePerFraction });
    setTimeout(() => {
      setIsLoading(false);
      alert('Asset fractionalized successfully! (Demo)');
    }, 2000);
  };

  const handleUnlock = () => {
    setIsLoading(true);
    console.log('Unlocking asset');
    setTimeout(() => {
      setIsLoading(false);
      alert('Unlock process initiated! (Demo)');
    }, 2000);
  };

  const handleCreateLoan = (loanData: LoanData) => {
    setIsLoading(true);
    console.log('Creating loan:', loanData);
    setTimeout(() => {
      setIsLoading(false);
      alert('Loan request submitted! (Demo)');
    }, 2000);
  };

  const handleRepayLoan = (loanId: string) => {
    console.log('Repaying loan:', loanId);
    alert('Loan repayment processed! (Demo)');
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

  // Launchpad handlers
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

  const sections = [
    { id: 'tokenization', name: 'Asset Tokenization', shortName: 'Tokenization' },
    { id: 'fractionalization', name: 'Fractionalization', shortName: 'Fractionalization' },
    { id: 'fractionalized', name: 'Fractionalized Asset', shortName: 'Fractionalized' },
    { id: 'lending', name: 'Asset Lending', shortName: 'Lending' },
    { id: 'auction', name: 'Auction System', shortName: 'Auctions' },
    { id: 'launchpad', name: 'Asset Launchpad', shortName: 'Launchpad' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-12 2xl:px-[104px] py-6 sm:py-8 lg:py-12 pt-20 sm:pt-24">
        {/* Demo Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4">RWA Protocol Demo</h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-2 sm:px-4 lg:px-0">
            Explore the complete Real World Asset tokenization platform with live component demonstrations
          </p>
        </div>

        {/* Mobile Navigation - Dropdown Style */}
        <div className="sm:hidden mb-6">
          <select 
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm"
          >
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.shortName}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Navigation - Button Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8 lg:mb-12">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg font-medium transition-all text-xs sm:text-sm lg:text-base ${
                activeSection === section.id
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-card border border-card-border text-foreground hover:bg-muted'
              }`}
            >
              <span className="lg:hidden">{section.shortName}</span>
              <span className="hidden lg:inline">{section.name}</span>
            </button>
          ))}
        </div>

        {/* Component Sections */}
        <div className="space-y-6 sm:space-y-8 lg:space-y-12">
          {activeSection === 'tokenization' && (
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 lg:mb-6">Asset Tokenization</h2>
              <AssetMintingForm 
                onMint={handleMintAsset}
                isLoading={isLoading}
              />
            </div>
          )}

          {activeSection === 'fractionalization' && (
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 lg:mb-6">Asset Fractionalization</h2>
              <FractionalizationInterface 
                assetData={sampleAssetData}
                onFractionalize={handleFractionalize}
                onUnlock={handleUnlock}
                isLoading={isLoading}
              />
            </div>
          )}

          {activeSection === 'fractionalized' && (
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 lg:mb-6">Fractionalized Asset Management</h2>
              <FractionalizationInterface 
                assetData={sampleFractionalizedAsset}
                onFractionalize={handleFractionalize}
                onUnlock={handleUnlock}
                isLoading={isLoading}
              />
            </div>
          )}

          {activeSection === 'lending' && (
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 lg:mb-6">Asset-Backed Lending</h2>
              <LendingInterface 
                assetData={sampleLendingAsset}
                onCreateLoan={handleCreateLoan}
                onRepayLoan={handleRepayLoan}
                isLoading={isLoading}
              />
            </div>
          )}

          {activeSection === 'auction' && (
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 lg:mb-6">Auction System</h2>
              <AuctionInterface 
                auction={sampleAuction}
                onPlaceBid={handlePlaceBid}
                onWithdrawBid={handleWithdrawBid}
                onClaimAsset={handleClaimAsset}
                isLoading={isLoading}
              />
            </div>
          )}

          {activeSection === 'launchpad' && (
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 lg:mb-6">Asset Launchpad</h2>
              <LaunchpadInterface 
                listings={sampleLaunchpadListings}
                userAssets={sampleUserAssets}
                onCreateListing={handleCreateListing}
                onPurchaseTokens={handlePurchaseTokens}
                onWithdrawTokens={handleWithdrawTokens}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>

        {/* Feature Overview - Mobile Optimized */}
        <div className="mt-12 sm:mt-16 lg:mt-20 bg-card rounded-lg border border-card-border p-4 sm:p-6 lg:p-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center">Platform Features</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4">
                <span className="text-lg sm:text-xl lg:text-2xl">🏛️</span>
              </div>
              <h4 className="font-semibold mb-1 text-xs sm:text-sm lg:text-base">Multi-Asset Support</h4>
              <p className="text-xs text-muted-foreground">Art, commodities, real estate</p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4">
                <span className="text-lg sm:text-xl lg:text-2xl">🔗</span>
              </div>
              <h4 className="font-semibold mb-1 text-xs sm:text-sm lg:text-base">Chainlink Powered</h4>
              <p className="text-xs text-muted-foreground">Functions, CCIP, Automation, PoR</p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4">
                <span className="text-lg sm:text-xl lg:text-2xl">🏦</span>
              </div>
              <h4 className="font-semibold mb-1 text-xs sm:text-sm lg:text-base">DeFi Integration</h4>
              <p className="text-xs text-muted-foreground">Lending, auctions, governance</p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4">
                <span className="text-lg sm:text-xl lg:text-2xl">🚀</span>
              </div>
              <h4 className="font-semibold mb-1 text-xs sm:text-sm lg:text-base">Asset Launchpad</h4>
              <p className="text-xs text-muted-foreground">IPO for tokenized assets</p>
            </div>
            <div className="text-center col-span-2 sm:col-span-1">
              <div className="bg-accent/10 rounded-full w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4">
                <span className="text-lg sm:text-xl lg:text-2xl">🌐</span>
              </div>
              <h4 className="font-semibold mb-1 text-xs sm:text-sm lg:text-base">Cross-Chain</h4>
              <p className="text-xs text-muted-foreground">Multi-network compatibility</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 