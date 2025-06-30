'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Copy, Check, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export type TransactionStatus = 'idle' | 'pending' | 'confirming' | 'confirmed' | 'failed';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: TransactionStatus;
  hash?: string;
  title?: string;
  description?: string;
  error?: string;
  confirmations?: number;
  requiredConfirmations?: number;
  onSuccess?: () => void;
}

export default function TransactionModal({
  isOpen,
  onClose,
  status,
  hash,
  title = 'Transaction',
  description,
  error,
  confirmations = 0,
  requiredConfirmations = 1,
  onSuccess
}: TransactionModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-call onSuccess when transaction is confirmed
  useEffect(() => {
    if (status === 'confirmed' && onSuccess) {
      onSuccess();
    }
  }, [status, onSuccess]);

  // Helper function to safely convert BigInt or number to number
  const safeToNumber = (value: number | bigint | undefined): number => {
    if (value === undefined || value === null) return 0;
    if (typeof value === 'bigint') return Number(value);
    return value;
  };

  // Convert confirmations to numbers for safe math operations
  const safeConfirmations = safeToNumber(confirmations);
  const safeRequiredConfirmations = safeToNumber(requiredConfirmations);

  const handleCopyHash = async () => {
    if (hash) {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatHash = (txHash: string) => {
    return `${txHash.slice(0, 6)}...${txHash.slice(-4)}`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="w-8 h-8 text-yellow-500 animate-pulse" />;
      case 'confirming':
        return <AlertCircle className="w-8 h-8 text-blue-500 animate-spin" />;
      case 'confirmed':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'failed':
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Clock className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'pending':
        return 'Transaction Pending';
      case 'confirming':
        return 'Confirming Transaction';
      case 'confirmed':
        return 'Transaction Confirmed';
      case 'failed':
        return 'Transaction Failed';
      default:
        return title;
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'pending':
        return 'Please confirm the transaction in your wallet...';
      case 'confirming':
        return `Waiting for network confirmation... (${safeConfirmations}/${safeRequiredConfirmations})`;
      case 'confirmed':
        return 'Your transaction has been successfully confirmed on the blockchain.';
      case 'failed':
        return error || 'The transaction failed. Please try again.';
      default:
        return description || 'Transaction in progress...';
    }
  };

  const getExplorerUrl = () => {
    if (!hash) return null;
    // This would typically be dynamic based on the current chain
    return `https://etherscan.io/tx/${hash}`;
  };

  if (!isOpen || !isMounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={status === 'confirmed' || status === 'failed' ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative bg-background border border-card-border rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md shadow-2xl backdrop-blur-md">
        {/* Close Button - Only show for completed states */}
        {(status === 'confirmed' || status === 'failed') && (
          <button
            onClick={onClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 hover:bg-card rounded-lg transition-colors"
          >
            <X className="w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground hover:text-foreground" />
          </button>
        )}

        {/* Content */}
        <div className="text-center space-y-4 sm:space-y-6">
          {/* Status Icon */}
          <div className="flex justify-center">
            {getStatusIcon()}
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              {getStatusTitle()}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {getStatusDescription()}
            </p>
          </div>

          {/* Transaction Hash */}
          {hash && (
            <div className="bg-card/50 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground mb-1">Transaction Hash</div>
                  <div className="text-xs sm:text-sm font-mono text-foreground truncate">
                    {formatHash(hash)}
                  </div>
                </div>
                <button
                  onClick={handleCopyHash}
                  className="flex items-center gap-1 px-2 py-1 hover:bg-card rounded transition-colors"
                  title="Copy transaction hash"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Progress Bar for Confirming State */}
          {status === 'confirming' && (
            <div className="space-y-2">
              <div className="w-full bg-card/50 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min((safeConfirmations / safeRequiredConfirmations) * 100, 100)}%` 
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {safeConfirmations} of {safeRequiredConfirmations} confirmations
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {/* View on Explorer */}
            {hash && (
              <button
                onClick={() => window.open(getExplorerUrl() || '#', '_blank')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-card/50 rounded-lg hover:bg-card transition-colors backdrop-blur-sm text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                View on Explorer
              </button>
            )}

            {/* Close/Continue Button */}
            {(status === 'confirmed' || status === 'failed') && (
              <button
                onClick={onClose}
                className={`w-full font-medium py-2.5 sm:py-3 rounded-lg transition-opacity text-sm ${
                  status === 'confirmed'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {status === 'confirmed' ? 'Continue' : 'Close'}
              </button>
            )}

            {/* Cancel Button for Pending */}
            {status === 'pending' && (
              <button
                onClick={onClose}
                className="w-full bg-secondary text-secondary-foreground font-medium py-2.5 sm:py-3 rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
} 