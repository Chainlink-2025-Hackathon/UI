'use client';

import { Search, Bell, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import WalletButton from './wallet/WalletButton';
import Link from 'next/link';

export default function Header() {
  const [activeTab, setActiveTab] = useState('Launchpad');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-[1232px] px-4 sm:px-0">
        <div className="bg-card/80 backdrop-blur-lg border border-card-border rounded-xl sm:rounded-2xl shadow-lg px-4 sm:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4 sm:gap-8">
              <Link href="/" className="flex items-center">
                <div className="bg-gradient-to-r from-[#CAFBFF] to-current font-bold text-base sm:text-lg text-foreground bg-clip-text">
                   Bagel
                </div>
              </Link>

              {/* Search - Hidden on mobile, shown on desktop */}
              <div className="relative hidden lg:block">
                <div className="flex items-center gap-3 bg-background/50 border border-card-border rounded-lg px-3 py-2 w-[200px] xl:w-[300px]">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search Assets"
                    className="bg-transparent text-foreground text-sm placeholder:text-muted-foreground flex-1 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Desktop Navigation & Actions */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Navigation Tabs */}
              <div className="flex items-center gap-6">
                {['Launchpad', 'Features', 'Portfolio'].map((tab) => (
                  <Link
                    key={tab}
                    href={
                      tab === 'Portfolio' ? '/portfolio' :
                      tab === 'Features' ? '/features' :
                      tab === 'Launchpad' ? '/demo' :
                      '/'
                    }
                    onClick={() => setActiveTab(tab)}
                    className={`font-manrope font-semibold text-sm transition-colors px-3 py-2 rounded-lg ${
                      activeTab === tab 
                        ? 'text-accent-foreground bg-accent' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {tab}
                  </Link>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Notification Button */}
                <button className="relative flex items-center justify-center bg-background/50 border border-card-border rounded-lg p-2 hover:bg-muted/50 transition-colors">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  {/* Notification Badge */}
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-accent-foreground rounded-full"></span>
                  </span>
                </button>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Wallet Button */}
                <WalletButton />
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Search Button for mobile */}
              <button className="flex items-center justify-center bg-background/50 border border-card-border rounded-lg p-2 hover:bg-muted/50 transition-colors">
                <Search className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Hamburger Menu */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-center bg-background/50 border border-card-border rounded-lg p-2 hover:bg-muted/50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Menu className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-20 left-4 right-4 bg-card border border-card-border rounded-xl shadow-lg p-6">
            {/* Mobile Search */}
            <div className="mb-6">
              <div className="flex items-center gap-3 bg-background/50 border border-card-border rounded-lg px-3 py-3">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search Assets"
                  className="bg-transparent text-foreground text-sm placeholder:text-muted-foreground flex-1 outline-none"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-4 mb-6">
              {['Launchpad', 'Features', 'Portfolio'].map((tab) => (
                <Link
                  key={tab}
                  href={
                    tab === 'Portfolio' ? '/portfolio' :
                    tab === 'Features' ? '/features' :
                    tab === 'Launchpad' ? '/demo' :
                    '/'
                  }
                  onClick={() => {
                    setActiveTab(tab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block font-manrope font-semibold text-base transition-colors px-4 py-3 rounded-lg ${
                    activeTab === tab 
                      ? 'text-accent-foreground bg-accent' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {tab}
                </Link>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-card-border">
              {/* Notification Button */}
              <button className="relative flex items-center justify-center bg-background/50 border border-card-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {/* Notification Badge */}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-accent-foreground rounded-full"></span>
                </span>
              </button>

              {/* Wallet Button */}
              <WalletButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 