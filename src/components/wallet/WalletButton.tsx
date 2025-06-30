'use client';

import { useState, useEffect } from 'react';
import { Wallet, ChevronDown } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import WalletConnectModal from './WalletConnectModal';

export default function WalletButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isConnected, displayName, isConnecting } = useWallet();

  // Prevent hydration mismatch by only rendering wallet-dependent content after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Show a consistent loading state during hydration
  if (!isMounted) {
    return (
      <button
        disabled
        className="flex items-center gap-2 font-medium px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all bg-accent text-accent-foreground opacity-50"
      >
        <Wallet className="w-4 h-4" />
        <span className="hidden sm:inline">Connect Wallet</span>
        <span className="sm:hidden">Connect</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={openModal}
        disabled={isConnecting}
        className={`flex items-center gap-2 font-medium px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all ${
          isConnected
            ? 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'
            : 'bg-accent text-accent-foreground hover:opacity-90'
        } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Wallet className="w-4 h-4" />
        {isConnecting ? (
          <span className="hidden sm:inline">Connecting...</span>
        ) : isConnected ? (
          <>
            <span className="hidden sm:inline">{displayName}</span>
            <span className="sm:hidden">Connected</span>
            <ChevronDown className="w-3 h-3" />
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Connect Wallet</span>
            <span className="sm:hidden">Connect</span>
          </>
        )}
      </button>

      <WalletConnectModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
} 