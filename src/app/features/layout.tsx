'use client';

import { useState, useEffect } from 'react';
import WalletButton from '@/components/wallet/WalletButton';
import ThemeToggle from '@/components/ThemeToggle';
import { useWallet } from '@/hooks/useWallet';
import { 
  Coins, 
  PieChart, 
  DollarSign, 
  Gavel, 
  Rocket, 
  Settings,
  ChevronRight,
  X,
  Menu,
  Wallet,
  Home,
  ArrowLeft
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { isConnected, displayName, formattedBalance, chain } = useWallet();
  const pathname = usePathname();

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const features = [
    { 
      id: 'tokenization', 
      name: 'Asset Tokenization', 
      description: 'Convert real-world assets into blockchain tokens',
      icon: Coins,
      color: 'text-blue-500',
      href: '/features/tokenization'
    },
    { 
      id: 'fractionalization', 
      name: 'Fractionalization', 
      description: 'Split asset ownership into fractional shares',
      icon: PieChart,
      color: 'text-purple-500',
      href: '/features/fractionalization'
    },
    { 
      id: 'fractionalized', 
      name: 'Portfolio Management', 
      description: 'Comprehensive view of all your assets and activities',
      icon: Wallet,
      color: 'text-green-500',
      href: '/features/fractionalized'
    },
    { 
      id: 'lending', 
      name: 'Asset-Backed Lending', 
      description: 'Use assets as collateral for loans',
      icon: DollarSign,
      color: 'text-yellow-500',
      href: '/features/lending'
    },
    { 
      id: 'auction', 
      name: 'Auction System', 
      description: 'Auction assets with automated bidding',
      icon: Gavel,
      color: 'text-red-500',
      href: '/features/auction'
    },
    { 
      id: 'launchpad', 
      name: 'Asset Launchpad', 
      description: 'Launch and invest in tokenized assets',
      icon: Rocket,
      color: 'text-indigo-500',
      href: '/features/launchpad'
    }
  ];

  const currentFeature = features.find(f => pathname.includes(f.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always Fixed */}
      <div className={`
        fixed left-0 top-0 h-screen w-80 bg-background border-r border-card-border z-50 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full bg-background">
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Back to Home Button */}
            <div className="mb-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>

            {/* Sidebar Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Platform Features</h2>
                <p className="text-sm text-muted-foreground">Explore our RWA capabilities</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Feature List */}
            <nav className="space-y-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                const isActive = pathname === feature.href || (pathname === '/features' && feature.id === 'tokenization');
                
                return (
                  <Link
                    key={feature.id}
                    href={feature.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      w-full text-left p-3 rounded-lg transition-all duration-200 block
                      ${isActive 
                        ? 'bg-accent text-accent-foreground shadow-sm border border-accent/20' 
                        : 'hover:bg-muted/50 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 mt-0.5 ${isActive ? 'text-accent-foreground' : feature.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-1">
                          {feature.name}
                        </div>
                        <div className={`text-xs leading-relaxed ${
                          isActive ? 'text-accent-foreground/80' : 'text-muted-foreground'
                        }`}>
                          {feature.description}
                        </div>
                      </div>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-accent-foreground/60" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Wallet Section - Fixed at bottom */}
          <div className="flex-shrink-0 p-6 border-t border-card-border bg-background">
            <div className="space-y-3">
              {isClient && isConnected ? (
                <div className="bg-accent/5 rounded-lg p-4 border border-accent/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Wallet className="w-4 h-4 text-accent" />
                    <span className="font-medium text-sm">Wallet Connected</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {displayName}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Balance:</span>
                    <span className="font-mono text-sm font-medium">
                      {formattedBalance} {chain?.nativeCurrency?.symbol || 'ETH'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-3">
                    Connect your wallet to interact with features
                  </p>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <WalletButton />
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - With left margin for sidebar */}
      <div className="lg:ml-80">
        {/* Mobile Menu Button */}
        <div className="lg:hidden sticky top-0 z-30 p-4 border-b border-card-border bg-card/95 backdrop-blur">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-background border border-card-border rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span className="text-sm font-medium">
              {currentFeature?.name || 'Select Feature'}
            </span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
} 