'use client';

import { useState, useEffect } from 'react';
import { useTransactionConfirmations, useAccount } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { TransactionStatus } from '@/components/wallet';

interface UseTransactionOptions {
  title?: string;
  description?: string;
  requiredConfirmations?: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useTransaction(options: UseTransactionOptions = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | undefined>();
  const [status, setStatus] = useState<TransactionStatus>('idle');
  const [error, setError] = useState<string | undefined>();

  const requiredConfirmations = options.requiredConfirmations || 1;

  // Get the current chain from the connected wallet for display purposes
  const { chain } = useAccount();

  // Watch for transaction confirmations on Avalanche Fuji (where contracts are deployed)
  const { 
    data: confirmations,
    isLoading: isConfirming,
    error: confirmationError,
    isError: hasConfirmationError,
    isFetched
  } = useTransactionConfirmations({
    hash: transactionHash as `0x${string}` | undefined,
    chainId: avalancheFuji.id, // Use Avalanche Fuji chain ID where contracts are deployed
    query: {
      enabled: !!transactionHash, // Only run when we have a transaction hash
      refetchInterval: 2000, // Check every 2 seconds for new confirmations
      retry: (failureCount, error) => {
        // Be more tolerant of TransactionNotFoundError - it's often just a timing issue
        const isTransactionNotFound = error.message.includes('TransactionNotFoundError') || 
                                     error.message.includes('could not be found');
        
        if (isTransactionNotFound && failureCount < 10) {
          // Keep retrying for TransactionNotFoundError up to 10 times (20 seconds)
          console.log(`Transaction not found yet, retrying... (attempt ${failureCount + 1}/10)`);
          return true;
        }
        
        // For other errors, retry up to 3 times
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => {
        // Exponential backoff, but cap at 5 seconds
        return Math.min(1000 * Math.pow(2, attemptIndex), 5000);
      },
    }
  });

  // Handle transaction status changes based on confirmations
  useEffect(() => {
    if (!transactionHash) return;

    console.log('Transaction confirmation update:', {
      hash: transactionHash,
      confirmations,
      requiredConfirmations,
      isConfirming,
      hasConfirmationError,
      isFetched,
      chainId: avalancheFuji.id
    });

    if (hasConfirmationError) {
      const isTransactionNotFound = confirmationError?.message.includes('TransactionNotFoundError') || 
                                   confirmationError?.message.includes('could not be found');
      
      if (isTransactionNotFound) {
        // Don't treat TransactionNotFoundError as a fatal error - just keep confirming
        console.log('Transaction not found yet, but continuing to wait...');
        setStatus('confirming');
        return;
      }
      
      // Only fail on actual errors, not timing issues
      console.error('Confirmation error:', confirmationError);
      setStatus('failed');
      const errorMessage = confirmationError?.message || 'Failed to check transaction confirmations';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } else if (typeof confirmations === 'number' || typeof confirmations === 'bigint') {
      const confirmationCount = Number(confirmations);
      console.log(`Transaction confirmations: ${confirmationCount}/${requiredConfirmations}`);
      
      if (confirmationCount >= requiredConfirmations) {
        // Transaction is confirmed with required confirmations
        console.log('Transaction confirmed successfully!');
        setStatus('confirmed');
        options.onSuccess?.();
      } else if (confirmationCount >= 0) {
        // Transaction is being confirmed
        setStatus('confirming');
      }
    } else if (isConfirming && !isFetched) {
      // Still waiting for first confirmation data
      console.log('Waiting for confirmation data...');
      setStatus('confirming');
    }
  }, [
    transactionHash, 
    confirmations, 
    isConfirming, 
    hasConfirmationError, 
    confirmationError, 
    requiredConfirmations, 
    isFetched,
    options
  ]);

  const startTransaction = (hash: string) => {
    console.log('Starting transaction confirmation tracking:', hash);
    setTransactionHash(hash);
    setStatus('confirming'); // Start in confirming state
    setError(undefined);
    setIsModalOpen(true);
  };

  const setTransactionPending = () => {
    console.log('Setting transaction to pending state');
    setStatus('pending');
    setIsModalOpen(true);
  };

  const setTransactionError = (errorMessage: string) => {
    console.error('Transaction error:', errorMessage);
    setStatus('failed');
    setError(errorMessage);
    setIsModalOpen(true);
    options.onError?.(errorMessage);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset after a delay to prevent flickering
    setTimeout(() => {
      if (!isModalOpen) {
        setStatus('idle');
        setTransactionHash(undefined);
        setError(undefined);
      }
    }, 300);
  };

  const reset = () => {
    console.log('Resetting transaction state');
    setStatus('idle');
    setTransactionHash(undefined);
    setError(undefined);
    setIsModalOpen(false);
  };

  // Convert confirmations to safe number for return
  const safeConfirmations = typeof confirmations === 'bigint' ? Number(confirmations) : (confirmations || 0);

  return {
    // Modal props
    isModalOpen,
    status,
    transactionHash,
    error,
    title: options.title,
    description: options.description,
    confirmations: safeConfirmations,
    requiredConfirmations,
    chainId: avalancheFuji.id, // Return the contract chain ID
    chainName: avalancheFuji.name, // Return the contract chain name
    connectedChainId: chain?.id, // Keep track of connected wallet chain
    connectedChainName: chain?.name,
    
    // Control functions
    startTransaction,
    setTransactionPending,
    setTransactionError,
    closeModal,
    reset,
    
    // State helpers
    isPending: status === 'pending',
    isConfirming: status === 'confirming',
    isConfirmed: status === 'confirmed',
    isFailed: status === 'failed',
    isLoading: status === 'pending' || status === 'confirming',
    
    // Debug helpers
    isConfirmationLoading: isConfirming,
    hasConfirmationData: typeof confirmations === 'number' || typeof confirmations === 'bigint',
    confirmationFetched: isFetched,
  };
} 