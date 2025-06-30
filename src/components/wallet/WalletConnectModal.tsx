'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Wallet, ExternalLink, Copy, Check } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useEnsName, useEnsAvatar } from 'wagmi';
import { Connector } from 'wagmi';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WalletOptionProps {
  connector: Connector;
  onClick: () => void;
}

function WalletOption({ connector, onClick }: WalletOptionProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  const getWalletIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'metamask':
        return '🦊';
      case 'walletconnect':
        return '🔗';
      case 'safe':
        return '🔒';
      case 'injected':
        return '🌐';
      default:
        return '👛';
    }
  };

  return (
    <button
      disabled={!ready}
      onClick={onClick}
      className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-card/50 border border-card-border rounded-lg hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
    >
      <div className="text-xl sm:text-2xl">{getWalletIcon(connector.name)}</div>
      <div className="flex-1 text-left">
        <div className="font-medium text-sm sm:text-base text-foreground">{connector.name}</div>
        <div className="text-xs sm:text-sm text-muted-foreground">
          {!ready ? 'Not available' : 'Connect to your wallet'}
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}

function WalletOptions() {
  const { connectors, connect, isPending } = useConnect();

  return (
    <div className="space-y-3">
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground">Connect Your Wallet</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Choose your preferred wallet to connect to RWA Protocol
        </p>
      </div>
      
      {connectors.map((connector) => (
        <WalletOption
          key={connector.uid}
          connector={connector}
          onClick={() => connect({ connector })}
        />
      ))}
      
      {isPending && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto"></div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">Connecting...</p>
        </div>
      )}
    </div>
  );
}

function ConnectedAccount({ onClose }: { onClose: () => void }) {
  const { address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground">Wallet Connected</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Your wallet is successfully connected to RWA Protocol
        </p>
      </div>

      {/* Avatar and Address */}
      <div className="flex flex-col items-center space-y-3 sm:space-y-4">
        {ensAvatar ? (
          <img 
            src={ensAvatar} 
            alt="ENS Avatar" 
            className="w-12 sm:w-16 h-12 sm:h-16 rounded-full"
          />
        ) : (
          <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-accent/20 flex items-center justify-center">
            <Wallet className="w-6 sm:w-8 h-6 sm:h-8 text-accent" />
          </div>
        )}

        <div className="text-center">
          {ensName && (
            <div className="font-medium text-base sm:text-lg text-foreground">{ensName}</div>
          )}
          <div className="text-xs sm:text-sm text-muted-foreground">
            {address && formatAddress(address)}
          </div>
        </div>

        {/* Copy Address Button */}
        <button
          onClick={handleCopyAddress}
          className="flex items-center gap-2 px-3 py-2 bg-card/50 rounded-lg hover:bg-card transition-colors backdrop-blur-sm"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm text-foreground">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm text-foreground">Copy Address</span>
            </>
          )}
        </button>
      </div>

      {/* Network Info */}
      {chain && (
        <div className="bg-card/50 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground">Network</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-xs sm:text-sm font-medium text-foreground">{chain.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onClose}
          className="w-full bg-accent text-accent-foreground font-medium py-2.5 sm:py-3 rounded-lg hover:opacity-90 transition-opacity text-sm"
        >
          Continue to App
        </button>
        
        <button
          onClick={handleDisconnect}
          className="w-full bg-secondary text-secondary-foreground font-medium py-2.5 sm:py-3 rounded-lg hover:opacity-90 transition-opacity text-sm"
        >
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
}

export default function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const { isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen || !isMounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-background border border-card-border rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md shadow-2xl backdrop-blur-md">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 hover:bg-card rounded-lg transition-colors"
        >
          <X className="w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground hover:text-foreground" />
        </button>

        {/* Content */}
        <div className="pt-8 sm:pt-2">
          {isConnected ? (
            <ConnectedAccount onClose={onClose} />
          ) : (
            <WalletOptions />
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
} 