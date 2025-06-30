'use client';

import { Palette, Building, Gem, Rocket, TrendingUp, Users, Coins, Shield, Gavel, Link2, Zap, Globe } from 'lucide-react';
import Link from 'next/link';

interface AssetListing {
  id: string;
  title: string;
  category: 'art' | 'real-estate' | 'commodity';
  image: string;
  description: string;
  pricePerToken: string;
  totalValue: string;
  tokenType: 'nft' | 'fractionalized';
  availableTokens: number;
  progress: number;
  participantCount: number;
  status: 'live' | 'upcoming' | 'sold-out';
  isVerified: boolean;
  isFeatured: boolean;
}

const sampleAssets: AssetListing[] = [
  // Art Category
  {
    id: '1',
    title: 'Contemporary Art Masterpiece',
    category: 'art',
    image: '/api/placeholder/400/300',
    description: 'Banksy original artwork with full provenance and authentication certificates',
    pricePerToken: '45.0',
    totalValue: '45.0',
    tokenType: 'nft',
    availableTokens: 1,
    progress: 0,
    participantCount: 0,
    status: 'upcoming',
    isVerified: false,
    isFeatured: false
  },
  {
    id: '2',
    title: 'Modern Art Collection',
    category: 'art',
    image: '/api/placeholder/400/300',
    description: 'Curated collection of contemporary paintings by emerging artists',
    pricePerToken: '0.025',
    totalValue: '125.0',
    tokenType: 'fractionalized',
    availableTokens: 4500,
    progress: 35,
    participantCount: 89,
    status: 'live',
    isVerified: true,
    isFeatured: true
  },
  // Real Estate Category
  {
    id: '3',
    title: 'Premium Dubai Real Estate Portfolio',
    category: 'real-estate',
    image: '/api/placeholder/400/300',
    description: 'Exclusive fractional ownership of luxury properties in Dubai Marina and Downtown Dubai',
    pricePerToken: '0.025',
    totalValue: '2500.0',
    tokenType: 'fractionalized',
    availableTokens: 75000,
    progress: 25,
    participantCount: 234,
    status: 'live',
    isVerified: true,
    isFeatured: true
  },
  {
    id: '4',
    title: 'Manhattan Commercial Property',
    category: 'real-estate',
    image: '/api/placeholder/400/300',
    description: 'Prime commercial real estate in the heart of Manhattan financial district',
    pricePerToken: '0.15',
    totalValue: '3750.0',
    tokenType: 'fractionalized',
    availableTokens: 20000,
    progress: 68,
    participantCount: 156,
    status: 'live',
    isVerified: true,
    isFeatured: false
  },
  // Commodity Category
  {
    id: '5',
    title: 'Rare Vintage Wine Collection',
    category: 'commodity',
    image: '/api/placeholder/400/300',
    description: 'Bordeaux first growth wines from exceptional vintages, professionally stored',
    pricePerToken: '0.15',
    totalValue: '1500.0',
    tokenType: 'fractionalized',
    availableTokens: 8500,
    progress: 15,
    participantCount: 89,
    status: 'live',
    isVerified: true,
    isFeatured: false
  },
  {
    id: '6',
    title: 'Swiss Gold Bars Collection',
    category: 'commodity',
    image: '/api/placeholder/400/300',
    description: 'LBMA certified gold bars stored in secure Swiss vaults with full insurance',
    pricePerToken: '0.045',
    totalValue: '2250.0',
    tokenType: 'fractionalized',
    availableTokens: 45000,
    progress: 85,
    participantCount: 312,
    status: 'live',
    isVerified: true,
    isFeatured: true
  }
];

const categories = [
  {
    id: 'art',
    name: 'Art & Collectibles',
    icon: Palette,
    description: 'Fine art, collectibles, and cultural artifacts',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: Building,
    description: 'Residential and commercial properties worldwide',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 'commodity',
    name: 'Commodities',
    icon: Gem,
    description: 'Precious metals, wine, and other physical assets',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  }
];

const platformFeatures = [
  {
    id: 'tokenization',
    title: 'Asset Tokenization',
    description: 'Convert real-world assets into blockchain tokens with verified authenticity',
    icon: Coins,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    stats: '500+ Assets Tokenized'
  },
  {
    id: 'fractionalization',
    title: 'Fractionalization',
    description: 'Split high-value assets into affordable fractional shares for broader access',
    icon: TrendingUp,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    stats: '10,000+ Fractions Available'
  },
  {
    id: 'lending',
    title: 'Asset-Backed Lending',
    description: 'Secure loans using tokenized assets as collateral with automated liquidation',
    icon: Shield,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    stats: '$2M+ Loans Originated'
  },
  {
    id: 'auctions',
    title: 'Smart Auctions',
    description: 'Dutch and English auctions for asset sales and liquidation events',
    icon: Gavel,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    stats: '150+ Auctions Completed'
  },
  {
    id: 'cross-chain',
    title: 'Cross-Chain Trading',
    description: 'Trade assets across multiple blockchains with Chainlink CCIP',
    icon: Link2,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    stats: '5+ Networks Supported'
  },
  {
    id: 'automation',
    title: 'Chainlink Powered',
    description: 'Oracle-verified data, automated processes, and proof of reserves',
    icon: Zap,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    stats: '99.9% Uptime'
  }
];

export default function AssetCategoryShowcase() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-500 bg-green-500/10';
      case 'upcoming': return 'text-blue-500 bg-blue-500/10';
      case 'sold-out': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    if (!cat) return null;
    const Icon = cat.icon;
    return <Icon className={`w-3 h-3 ${cat.color}`} />;
  };

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-12 2xl:px-[104px]">
      {/* Asset Categories Section */}
      <div className="py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4">Asset Categories</h2>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-2 sm:px-4 lg:px-0">
            Discover tokenized real-world assets across multiple categories
          </p>
        </div>

        {/* Category Overview - Mobile Optimized Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            const categoryAssets = sampleAssets.filter(asset => asset.category === category.id);
            const liveCount = categoryAssets.filter(asset => asset.status === 'live').length;
            
            return (
              <div key={category.id} className="bg-card rounded-lg border border-card-border p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow">
                <div className={`w-7 sm:w-8 lg:w-10 h-7 sm:h-8 lg:h-10 rounded-lg ${category.bgColor} flex items-center justify-center mb-2 sm:mb-3`}>
                  <Icon className={`w-3.5 sm:w-4 lg:w-5 h-3.5 sm:h-4 lg:h-5 ${category.color}`} />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">{category.name}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{category.description}</p>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-muted-foreground">{categoryAssets.length} assets</span>
                  <span className="text-green-500 font-medium">{liveCount} live</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured Assets - Mobile Optimized Grid */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">Featured Assets</h3>
            <Link href="/demo" className="text-accent hover:text-accent/80 font-medium text-sm sm:text-base">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {sampleAssets.slice(0, 6).map((asset) => (
              <div key={asset.id} className="bg-card rounded-lg border border-card-border overflow-hidden hover:shadow-lg transition-shadow">
                {/* Compact Asset Image */}
                <div className="relative">
                  <img 
                    src={asset.image} 
                    alt={asset.title}
                    className="w-full h-24 sm:h-28 lg:h-32 object-cover"
                  />
                  <div className="absolute top-1 sm:top-1.5 lg:top-2 left-1 sm:left-1.5 lg:left-2 flex flex-wrap gap-1">
                    {asset.isFeatured && (
                      <div className="bg-accent text-accent-foreground px-1 sm:px-1.5 py-0.5 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                    {asset.isVerified && (
                      <div className="bg-green-500 text-white px-1 py-0.5 rounded-full text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                  <div className={`absolute top-1 sm:top-1.5 lg:top-2 right-1 sm:right-1.5 lg:right-2 px-1 sm:px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                    {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                  </div>
                  
                  {/* Compact Badges */}
                  <div className="absolute bottom-1 sm:bottom-1.5 lg:bottom-2 left-1 sm:left-1.5 lg:left-2 flex gap-1">
                    <div className="bg-black/60 text-white px-1 sm:px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-0.5">
                      {getCategoryIcon(asset.category)}
                      {asset.category === 'real-estate' ? 'RE' : 
                       asset.category === 'commodity' ? 'Com' : 'Art'}
                    </div>
                    <div className="bg-black/60 text-white px-1 sm:px-1.5 py-0.5 rounded-full text-xs font-medium">
                      {asset.tokenType === 'fractionalized' ? 'Frac' : 'NFT'}
                    </div>
                  </div>
                </div>

                {/* Compact Content */}
                <div className="p-2.5 sm:p-3 lg:p-4 space-y-2 sm:space-y-2.5 lg:space-y-3">
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm lg:text-base mb-0.5 sm:mb-1 line-clamp-1">{asset.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{asset.description}</p>
                  </div>

                  {/* Compact Progress for Fractionalized */}
                  {asset.tokenType === 'fractionalized' && asset.status === 'live' && (
                    <div className="space-y-1 sm:space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{asset.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1">
                        <div 
                          className="bg-accent h-1 rounded-full transition-all"
                          style={{ width: `${asset.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{asset.participantCount} investors</span>
                        <span className="hidden sm:inline">{asset.availableTokens.toLocaleString()} available</span>
                        <span className="sm:hidden">{(asset.availableTokens / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  )}

                  {/* Compact Pricing */}
                  <div className="flex justify-between items-center pt-1.5 sm:pt-2 border-t border-card-border">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {asset.tokenType === 'nft' ? 'Price' : 'Per Token'}
                      </p>
                      <p className="font-semibold text-accent text-xs sm:text-sm">{asset.pricePerToken} ETH</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-semibold text-xs sm:text-sm">{asset.totalValue} ETH</p>
                    </div>
                  </div>

                  {/* Compact Action Button */}
                  <Link href="/demo">
                    <button className="w-full bg-accent text-accent-foreground font-medium py-1.5 sm:py-2 lg:py-2.5 rounded-md text-xs sm:text-sm hover:opacity-90 transition-opacity">
                      {asset.status === 'live' ? 'Invest' : 
                       asset.status === 'upcoming' ? 'Soon' : 'View'}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Features Section */}
      <div className="py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4">Platform Features</h2>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-2 sm:px-4 lg:px-0">
            Complete infrastructure for real-world asset tokenization, trading, and investment
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12 lg:mb-16">
          {platformFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.id} className="bg-card rounded-lg border border-card-border p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow">
                <div className={`w-7 sm:w-8 lg:w-10 h-7 sm:h-8 lg:h-10 rounded-lg ${feature.bgColor} flex items-center justify-center mb-2 sm:mb-3 lg:mb-4`}>
                  <Icon className={`w-3.5 sm:w-4 lg:w-5 h-3.5 sm:h-4 lg:h-5 ${feature.color}`} />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 line-clamp-2">{feature.description}</p>
                <div className="text-xs font-medium text-accent">{feature.stats}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-accent/5 rounded-lg p-4 sm:p-6 lg:p-8 xl:p-12">
        <Rocket className="w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 text-accent mx-auto mb-3 sm:mb-4 lg:mb-6" />
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4">Ready to Start Investing?</h3>
        <p className="text-muted-foreground mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-0">
          Join thousands of investors accessing premium real-world assets through blockchain technology
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center max-w-sm sm:max-w-none mx-auto">
          <Link href="/demo">
            <button className="w-full sm:w-auto bg-accent text-accent-foreground font-medium px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-md hover:opacity-90 transition-opacity text-sm sm:text-base">
              Explore Launchpad
            </button>
          </Link>
          <Link href="/demo">
            <button className="w-full sm:w-auto bg-card border border-card-border text-foreground font-medium px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-md hover:bg-muted transition-colors text-sm sm:text-base">
              View Demo
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 