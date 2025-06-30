'use client';

import { useState } from 'react';
import { Droplets, Coins, AlertCircle, CheckCircle, ExternalLink, Copy } from 'lucide-react';
import { useWriteContract } from 'wagmi';
import { useWallet } from '@/hooks/useWallet';
import { useTransaction } from '@/hooks/useTransaction';
import { TransactionModal } from '@/components/wallet';
import { useMintMockUSDC } from '@/hooks/useApi';

export default function FaucetPage() {
  const [mintAmount, setMintAmount] = useState('1000');
  const [copied, setCopied] = useState(false);
  
  // Wallet integration
  const { address, isConnected, formatAddress } = useWallet();
  
  // API hooks
  const mintMockUSDC = useMintMockUSDC();
  
  // Transaction management
  const faucetTransaction = useTransaction({
    title: 'Mint MockUSDC Tokens',
    description: 'Minting test USDC tokens from faucet',
    requiredConfirmations: 1,
    onSuccess: () => {
      console.log('MockUSDC tokens minted successfully');
      // Reset form
      setMintAmount('1000');
    },
    onError: (error) => {
      console.error('Faucet mint error:', error);
    }
  });

  // Wagmi hook for contract interactions
  const { writeContract } = useWriteContract();

  const handleMintTokens = async () => {
    if (!address || !mintAmount) return;

    try {
      console.log('Starting MockUSDC mint for address:', address, 'amount:', mintAmount);
      faucetTransaction.setTransactionPending();
      
      const mintRes = await mintMockUSDC.mutateAsync({
        userAddress: address,
        amount: parseFloat(mintAmount)
      });
      
      if (!mintRes.data) throw new Error('Failed to get mint transaction data');

      // Handle contract call data
      const contractCallData = mintRes.contractCall || mintRes.data;
      
      if (contractCallData && typeof contractCallData === 'object' && 'address' in contractCallData) {
        const callData = contractCallData as {
          address: string;
          abi: readonly unknown[];
          functionName: string;
          args?: readonly unknown[];
          value?: bigint;
        };
        
        const contractConfig = {
          address: callData.address as `0x${string}`,
          abi: callData.abi,
          functionName: callData.functionName,
          args: callData.args || [],
        };
        
        if (callData.value && callData.value > BigInt(0)) {
          (contractConfig as typeof contractConfig & { value: bigint }).value = callData.value;
        }
        
        writeContract(contractConfig, {
          onSuccess: (hash) => {
            console.log('MockUSDC mint transaction submitted with hash:', hash);
            faucetTransaction.startTransaction(hash);
          },
          onError: (error) => {
            console.error('MockUSDC mint writeContract error:', error);
            faucetTransaction.setTransactionError(error.message);
          }
        });
      } else {
        // Fallback for direct transaction hash
        if ('txHash' in mintRes.data) {
          console.log('Using direct transaction hash for MockUSDC mint:', mintRes.data.txHash);
          faucetTransaction.startTransaction(mintRes.data.txHash);
        } else {
          throw new Error('Invalid mint response format');
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mint MockUSDC';
      console.error('MockUSDC mint error:', errorMessage);
      faucetTransaction.setTransactionError(errorMessage);
    }
  };

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const mockUsdcAddress = '0x2F40c6332140FEaE440372dA6D0231B34CE9080B';
  const presetAmounts = [100, 500, 1000, 5000, 10000];

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Droplets className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold">MockUSDC Faucet</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get test USDC tokens for the Avalanche Fuji testnet. These tokens are for testing purposes only and have no real value.
            </p>
          </div>

          {/* Main Faucet Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg border border-card-border p-6">
              {/* Wallet Connection Status */}
              {!isConnected ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <p className="text-yellow-800 text-sm font-medium">
                      Please connect your wallet to use the faucet
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-green-800 text-sm font-medium">Wallet Connected</p>
                        <p className="text-green-700 text-xs">{formatAddress(address)}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleCopyAddress}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 hover:bg-green-200 rounded transition-colors"
                      title="Copy address"
                    >
                      {copied ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-green-600" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Amount Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount to Mint (USDC)</label>
                  <input
                    type="number"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-card-border rounded-md bg-background text-foreground text-sm"
                    placeholder="Enter amount"
                    min="1"
                    max="10000"
                    disabled={!isConnected}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum: 10,000 USDC per transaction
                  </p>
                </div>

                {/* Preset Amount Buttons */}
                <div>
                  <p className="text-sm font-medium mb-2">Quick Select:</p>
                  <div className="grid grid-cols-5 gap-2">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setMintAmount(amount.toString())}
                        disabled={!isConnected}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          mintAmount === amount.toString()
                            ? 'bg-blue-500 text-white'
                            : 'bg-background border border-card-border text-foreground hover:bg-card disabled:opacity-50'
                        }`}
                      >
                        {amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mint Button */}
                <button
                  onClick={handleMintTokens}
                  disabled={!isConnected || !mintAmount || faucetTransaction.isLoading || parseFloat(mintAmount) <= 0}
                  className="w-full bg-blue-500 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {faucetTransaction.isLoading ? (
                    'Minting Tokens...'
                  ) : (
                    <>
                      <Coins className="w-4 h-4 inline mr-2" />
                      Mint {mintAmount} MockUSDC
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Token Information */}
            <div className="mt-6 bg-card rounded-lg border border-card-border p-6">
              <h3 className="text-lg font-semibold mb-4">Token Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Token Name:</span>
                  <span className="font-medium">MockUSDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Symbol:</span>
                  <span className="font-medium">USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Decimals:</span>
                  <span className="font-medium">6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Contract Address:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{mockUsdcAddress}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(mockUsdcAddress)}
                      className="p-1 hover:bg-muted rounded"
                      title="Copy contract address"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network:</span>
                  <span className="font-medium">Avalanche Fuji Testnet</span>
                </div>
              </div>
            </div>

            {/* Usage Instructions */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">How to Use</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Connect your wallet to the Avalanche Fuji testnet</li>
                <li>Enter the amount of MockUSDC you want to mint (max 10,000 per transaction)</li>
                <li>Click "Mint MockUSDC" and confirm the transaction in your wallet</li>
                <li>Wait for the transaction to be confirmed</li>
                <li>The tokens will appear in your wallet balance</li>
              </ol>
              
              <div className="mt-4 p-3 bg-blue-100 rounded-md">
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> These are test tokens with no real value. 
                  You may need to add the token to your wallet using the contract address above.
                </p>
              </div>
            </div>

            {/* Network Information */}
            <div className="mt-6 bg-card rounded-lg border border-card-border p-6">
              <h3 className="text-lg font-semibold mb-4">Network Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Network Name:</p>
                  <p className="font-medium">Avalanche Fuji C-Chain</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Chain ID:</p>
                  <p className="font-medium">43113</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">RPC URL:</p>
                  <p className="font-mono text-xs">https://api.avax-test.network/ext/bc/C/rpc</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Block Explorer:</p>
                  <a 
                    href="https://testnet.snowtrace.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                  >
                    testnet.snowtrace.io
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={faucetTransaction.isModalOpen}
        onClose={faucetTransaction.closeModal}
        status={faucetTransaction.status}
        hash={faucetTransaction.transactionHash}
        title={faucetTransaction.title}
        description={faucetTransaction.description}
        error={faucetTransaction.error}
        confirmations={faucetTransaction.confirmations}
        requiredConfirmations={faucetTransaction.requiredConfirmations}
      />
    </>
  );
} 