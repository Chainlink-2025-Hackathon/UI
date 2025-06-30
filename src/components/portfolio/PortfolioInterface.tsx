'use client';

import { useState } from 'react';
import { 
  Wallet, 
  PieChart, 
  CreditCard, 
  TrendingUp, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  MoreHorizontal,
  Filter,
  Search,
  Droplets
} from 'lucide-react';

interface PortfolioInterfaceProps {
  userAddress?: string;
}

// Mock data structures - to be replaced with real API data later
interface NFTAsset {
  tokenId: string;
  name: string;
  type: string;
  value: string;
  location: string;
  status: 'active' | 'fractionalized' | 'collateral';
  lastAppraisal: string;
  image?: string;
}

interface FractionalToken {
  assetId: string;
  assetName: string;
  tokenAddress: string;
  totalSupply: string;
  ownedAmount: string;
  ownershipPercentage: number;
  currentValue: string;
  pricePerToken: string;
  status: 'active' | 'locked';
}

interface LiquidityPoolToken {
  poolId: string;
  poolName: string;
  lpTokenAddress: string;
  lpTokenAmount: string;
  poolShare: number;
  totalPoolValue: string;
  userPoolValue: string;
  token0: {
    symbol: string;
    amount: string;
    value: string;
  };
  token1: {
    symbol: string;
    amount: string;
    value: string;
  };
  apr: number;
  rewardsEarned: string;
  status: 'active' | 'withdrawn';
  providedAt: string;
}

interface LoanPosition {
  loanId: string;
  type: 'borrowed' | 'lent';
  collateralAsset: string;
  loanAmount: string;
  interestRate: number;
  duration: string;
  status: 'active' | 'pending' | 'completed' | 'defaulted';
  dueDate: string;
  healthRatio?: number;
}

interface LaunchpadOrder {
  orderId: string;
  assetName: string;
  orderType: 'buy' | 'sell';
  amount: string;
  price: string;
  status: 'pending' | 'partially_filled' | 'completed' | 'cancelled';
  createdAt: string;
  filledAmount?: string;
}

export default function PortfolioInterface({ userAddress }: PortfolioInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'nfts' | 'fractionalized' | 'liquidity' | 'loans' | 'launchpad'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data - replace with real API calls later
  const portfolioStats = {
    totalValue: '125.75',
    nftCount: 8,
    fractionalTokens: 12,
    liquidityPools: 4,
    activeLoans: 3,
    launchpadOrders: 5
  };

  const mockNFTs: NFTAsset[] = [
    {
      tokenId: '1',
      name: 'Premium Artwork #1',
      type: 'Art',
      value: '25.50',
      location: 'NYC Vault',
      status: 'active',
      lastAppraisal: '2024-01-15'
    },
    {
      tokenId: '2', 
      name: 'Gold Commodity Token',
      type: 'Commodity',
      value: '45.20',
      location: 'Swiss Bank',
      status: 'fractionalized',
      lastAppraisal: '2024-01-10'
    },
    {
      tokenId: '3',
      name: 'Real Estate Property',
      type: 'Real Estate',
      value: '150.00',
      location: 'London',
      status: 'collateral',
      lastAppraisal: '2024-01-12'
    }
  ];

  const mockFractionalTokens: FractionalToken[] = [
    {
      assetId: 'frac-1',
      assetName: 'Vintage Wine Collection',
      tokenAddress: '0x1234...5678',
      totalSupply: '10000',
      ownedAmount: '250',
      ownershipPercentage: 2.5,
      currentValue: '5.75',
      pricePerToken: '0.023',
      status: 'active'
    },
    {
      assetId: 'frac-2',
      assetName: 'Digital Art Masterpiece',
      tokenAddress: '0xabcd...efgh',
      totalSupply: '5000',
      ownedAmount: '500',
      ownershipPercentage: 10.0,
      currentValue: '12.50',
      pricePerToken: '0.025',
      status: 'active'
    }
  ];

  const mockLiquidityPools: LiquidityPoolToken[] = [
    {
      poolId: 'pool-1',
      poolName: 'ETH/USDC',
      lpTokenAddress: '0xpool1...abcd',
      lpTokenAmount: '1.25',
      poolShare: 0.05,
      totalPoolValue: '2,500,000',
      userPoolValue: '1,250.00',
      token0: {
        symbol: 'ETH',
        amount: '0.5',
        value: '625.00'
      },
      token1: {
        symbol: 'USDC',
        amount: '625.00',
        value: '625.00'
      },
      apr: 12.5,
      rewardsEarned: '15.75',
      status: 'active',
      providedAt: '2024-01-10'
    },
    {
      poolId: 'pool-2',
      poolName: 'WBTC/ETH',
      lpTokenAddress: '0xpool2...efgh',
      lpTokenAmount: '0.75',
      poolShare: 0.02,
      totalPoolValue: '1,800,000',
      userPoolValue: '360.00',
      token0: {
        symbol: 'WBTC',
        amount: '0.008',
        value: '180.00'
      },
      token1: {
        symbol: 'ETH',
        amount: '0.072',
        value: '180.00'
      },
      apr: 18.2,
      rewardsEarned: '8.45',
      status: 'active',
      providedAt: '2024-01-08'
    },
    {
      poolId: 'pool-3',
      poolName: 'USDC/DAI',
      lpTokenAddress: '0xpool3...ijkl',
      lpTokenAmount: '2.10',
      poolShare: 0.1,
      totalPoolValue: '500,000',
      userPoolValue: '500.00',
      token0: {
        symbol: 'USDC',
        amount: '250.00',
        value: '250.00'
      },
      token1: {
        symbol: 'DAI',
        amount: '250.00',
        value: '250.00'
      },
      apr: 8.7,
      rewardsEarned: '4.25',
      status: 'active',
      providedAt: '2024-01-12'
    }
  ];

  const mockLoans: LoanPosition[] = [
    {
      loanId: 'loan-1',
      type: 'borrowed',
      collateralAsset: 'Real Estate Property',
      loanAmount: '75.00',
      interestRate: 8.5,
      duration: '6 months',
      status: 'active',
      dueDate: '2024-07-15',
      healthRatio: 1.8
    },
    {
      loanId: 'loan-2',
      type: 'lent',
      collateralAsset: 'Gold Commodity',
      loanAmount: '30.00',
      interestRate: 7.2,
      duration: '3 months',
      status: 'active',
      dueDate: '2024-04-15'
    }
  ];

  const mockLaunchpadOrders: LaunchpadOrder[] = [
    {
      orderId: 'order-1',
      assetName: 'Rare Diamond Collection',
      orderType: 'buy',
      amount: '1.5',
      price: '25.00',
      status: 'pending',
      createdAt: '2024-01-14'
    },
    {
      orderId: 'order-2',
      assetName: 'Vintage Car Fraction',
      orderType: 'sell',
      amount: '500',
      price: '0.05',
      status: 'partially_filled',
      createdAt: '2024-01-13',
      filledAmount: '200'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'failed': case 'defaulted': case 'cancelled': return 'text-red-600 bg-red-100';
      case 'fractionalized': return 'text-purple-600 bg-purple-100';
      case 'collateral': return 'text-orange-600 bg-orange-100';
      case 'partially_filled': return 'text-indigo-600 bg-indigo-100';
      case 'withdrawn': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'failed': case 'defaulted': case 'cancelled': return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Wallet },
    { id: 'nfts', label: 'NFT Assets', icon: Shield },
    { id: 'fractionalized', label: 'Fractionalized', icon: PieChart },
    { id: 'liquidity', label: 'Liquidity Pools', icon: Droplets },
    { id: 'loans', label: 'Loans', icon: CreditCard },
    { id: 'launchpad', label: 'Launchpad', icon: TrendingUp }
  ];

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">
            {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Your asset portfolio'}
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm"
            />
          </div>
          <button className="p-2 border border-card-border rounded-lg bg-background hover:bg-card transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Portfolio Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-card rounded-lg p-4 border border-card-border">
          <div className="text-2xl font-bold text-foreground">{portfolioStats.totalValue} ETH</div>
          <div className="text-sm text-muted-foreground">Total Value</div>
        </div>
        <div className="bg-card rounded-lg p-4 border border-card-border">
          <div className="text-2xl font-bold text-foreground">{portfolioStats.nftCount}</div>
          <div className="text-sm text-muted-foreground">NFT Assets</div>
        </div>
        <div className="bg-card rounded-lg p-4 border border-card-border">
          <div className="text-2xl font-bold text-foreground">{portfolioStats.fractionalTokens}</div>
          <div className="text-sm text-muted-foreground">Fractional Tokens</div>
        </div>
        <div className="bg-card rounded-lg p-4 border border-card-border">
          <div className="text-2xl font-bold text-foreground">{portfolioStats.liquidityPools}</div>
          <div className="text-sm text-muted-foreground">Liquidity Pools</div>
        </div>
        <div className="bg-card rounded-lg p-4 border border-card-border">
          <div className="text-2xl font-bold text-foreground">{portfolioStats.activeLoans}</div>
          <div className="text-sm text-muted-foreground">Active Loans</div>
        </div>
        <div className="bg-card rounded-lg p-4 border border-card-border">
          <div className="text-2xl font-bold text-foreground">{portfolioStats.launchpadOrders}</div>
          <div className="text-sm text-muted-foreground">Launchpad Orders</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-card-border">
        <nav className="flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-card rounded-lg p-4 border border-card-border">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Asset Fractionalized</div>
                        <div className="text-xs text-muted-foreground">Gold Commodity Token</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">2h ago</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Droplets className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Liquidity Provided</div>
                        <div className="text-xs text-muted-foreground">ETH/USDC Pool</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">4h ago</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Loan Approved</div>
                        <div className="text-xs text-muted-foreground">75.00 ETH borrowed</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">1d ago</div>
                  </div>
                </div>
              </div>

              {/* Asset Distribution */}
              <div className="bg-card rounded-lg p-4 border border-card-border">
                <h3 className="text-lg font-semibold mb-4">Asset Distribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">NFT Assets</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-[45%]"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Liquidity Pools</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full w-[30%]"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fractional Tokens</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full w-[15%]"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Loan Positions</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-[10%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NFT Assets Tab */}
        {activeTab === 'nfts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">NFT Assets ({mockNFTs.length})</h3>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="fractionalized">Fractionalized</option>
                <option value="collateral">Used as Collateral</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {mockNFTs.map((nft) => (
                <div key={nft.tokenId} className="bg-card rounded-lg p-4 border border-card-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{nft.name}</h4>
                      <p className="text-xs text-muted-foreground">{nft.type} • {nft.location}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(nft.status)}`}>
                      {getStatusIcon(nft.status)}
                      {nft.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Value</span>
                      <span className="font-medium">{nft.value} ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Appraisal</span>
                      <span>{nft.lastAppraisal}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-card-border flex gap-2">
                    <button className="flex-1 px-3 py-2 text-xs bg-accent text-accent-foreground rounded-md hover:opacity-90 transition-opacity">
                      View Details
                    </button>
                    <button className="p-2 border border-card-border rounded-md hover:bg-card transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fractionalized Tokens Tab */}
        {activeTab === 'fractionalized' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fractionalized Tokens ({mockFractionalTokens.length})</h3>
            
            <div className="bg-card rounded-lg border border-card-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Asset</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Owned</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ownership %</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Value</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Price/Token</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockFractionalTokens.map((token) => (
                      <tr key={token.assetId} className="border-t border-card-border">
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-sm">{token.assetName}</div>
                            <div className="text-xs text-muted-foreground">{token.tokenAddress}</div>
                          </div>
                        </td>
                        <td className="p-4 text-sm">{token.ownedAmount} / {token.totalSupply}</td>
                        <td className="p-4 text-sm">{token.ownershipPercentage}%</td>
                        <td className="p-4 text-sm font-medium">{token.currentValue} ETH</td>
                        <td className="p-4 text-sm">{token.pricePerToken} ETH</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(token.status)}`}>
                            {getStatusIcon(token.status)}
                            {token.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <button className="p-1 hover:bg-card rounded transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Liquidity Pools Tab */}
        {activeTab === 'liquidity' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Liquidity Pool Positions ({mockLiquidityPools.length})</h3>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mockLiquidityPools.map((pool) => (
                <div key={pool.poolId} className="bg-card rounded-lg p-4 border border-card-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Droplets className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{pool.poolName}</h4>
                        <p className="text-xs text-muted-foreground">Pool Share: {pool.poolShare}%</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pool.status)}`}>
                      {getStatusIcon(pool.status)}
                      {pool.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Pool Value */}
                    <div className="bg-background rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Your Position</span>
                        <span className="text-sm font-bold">{pool.userPoolValue} ETH</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{pool.token0.symbol}:</span>
                          <span>{pool.token0.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{pool.token1.symbol}:</span>
                          <span>{pool.token1.amount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pool Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">LP Tokens</div>
                        <div className="font-medium">{pool.lpTokenAmount}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">APR</div>
                        <div className="font-medium text-green-600">{pool.apr}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Rewards Earned</div>
                        <div className="font-medium">{pool.rewardsEarned} ETH</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Provided</div>
                        <div className="font-medium">{pool.providedAt}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-card-border flex gap-2">
                    <button className="flex-1 px-3 py-2 text-xs bg-accent text-accent-foreground rounded-md hover:opacity-90 transition-opacity">
                      Manage Position
                    </button>
                    <button className="px-3 py-2 text-xs border border-card-border rounded-md hover:bg-card transition-colors">
                      Withdraw
                    </button>
                    <button className="p-2 border border-card-border rounded-md hover:bg-card transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loans Tab */}
        {activeTab === 'loans' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Loan Positions ({mockLoans.length})</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mockLoans.map((loan) => (
                <div key={loan.loanId} className="bg-card rounded-lg p-4 border border-card-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-sm">
                        {loan.type === 'borrowed' ? 'Borrowed' : 'Lent'} - {loan.loanAmount} ETH
                      </h4>
                      <p className="text-xs text-muted-foreground">Collateral: {loan.collateralAsset}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                      {getStatusIcon(loan.status)}
                      {loan.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Interest Rate</span>
                      <span>{loan.interestRate}% APR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span>{loan.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date</span>
                      <span>{loan.dueDate}</span>
                    </div>
                    {loan.healthRatio && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Health Ratio</span>
                        <span className={loan.healthRatio > 1.5 ? 'text-green-600' : 'text-yellow-600'}>
                          {loan.healthRatio.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-card-border">
                    <button className="w-full px-3 py-2 text-xs bg-accent text-accent-foreground rounded-md hover:opacity-90 transition-opacity">
                      {loan.type === 'borrowed' ? 'Manage Loan' : 'View Details'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Launchpad Tab */}
        {activeTab === 'launchpad' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Launchpad Orders ({mockLaunchpadOrders.length})</h3>
            
            <div className="bg-card rounded-lg border border-card-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Asset</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Price</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Progress</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLaunchpadOrders.map((order) => (
                      <tr key={order.orderId} className="border-t border-card-border">
                        <td className="p-4 font-medium text-sm">{order.assetName}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.orderType === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {order.orderType.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-sm">{order.amount}</td>
                        <td className="p-4 text-sm">{order.price} ETH</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-sm">
                          {order.filledAmount ? `${order.filledAmount}/${order.amount}` : '-'}
                        </td>
                        <td className="p-4 text-sm">{order.createdAt}</td>
                        <td className="p-4">
                          <button className="p-1 hover:bg-card rounded transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 