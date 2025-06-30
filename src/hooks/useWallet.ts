'use client';

import { useAccount, useConnect, useDisconnect, useEnsName, useEnsAvatar, useBalance } from 'wagmi';

export function useWallet() {
  const { address, isConnected, isConnecting, chain } = useAccount();
  const { connect, connectors, isPending: isConnectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const { data: balance } = useBalance({ address });

  const formatAddress = (addr?: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (balance?: bigint, decimals: number = 4) => {
    if (!balance) return '0';
    const formatted = Number(balance) / Math.pow(10, 18);
    return formatted.toFixed(decimals);
  };

  return {
    // Connection status
    address,
    isConnected,
    isConnecting: isConnecting || isConnectPending,
    chain,
    
    // ENS data
    ensName,
    ensAvatar,
    
    // Balance
    balance,
    formattedBalance: formatBalance(balance?.value),
    
    // Actions
    connect,
    disconnect,
    connectors,
    
    // Utilities
    formatAddress,
    displayName: ensName || formatAddress(address),
    shortAddress: formatAddress(address),
  };
} 