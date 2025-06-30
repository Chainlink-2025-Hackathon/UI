'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  useHealthCheck,
  useUserAssets,
  useAssetInfo,
  useMintAsset,
  useFractionalizeAsset,
  useCreateLoan,
  useActiveLoans,
  useApproveToken,
} from '../../hooks/useApi';

export default function ApiExample() {
  const { address, isConnected } = useAccount();
  const [selectedTokenId, setSelectedTokenId] = useState<string>('1');
  const [apiMessage, setApiMessage] = useState<string>('');

  // Mint Asset Form State
  const [mintForm, setMintForm] = useState({
    assetType: 'artwork',
    physicalLocation: 'Secure Art Storage Facility',
    appraisalValueUSD: 100000,
    custodian: 'SecureArt Storage Inc',
    authenticityCertHash: '0xabc123def456...',
    metadataURI: 'ipfs://QmExampleMetadata...'
  });

  // Fractionalization Form State
  const [fractionForm, setFractionForm] = useState({
    fractionalSupply: '1000000',
    reservePrice: '100'
  });

  // Loan Form State
  const [loanForm, setLoanForm] = useState({
    assetNftContract: '0xAssetNFTContract',
    loanTokenAddress: '0xLoanTokenContract',
    amount: 50000,
    intrestRate: 500,
    duration: 2592000
  });

  // Token Approval Form State
  const [tokenForm, setTokenForm] = useState({
    tokenAddress: '0xTokenContract',
    amount: 1000000,
    spender: '0xSpenderContract'
  });

  // Health check
  const { data: healthData, isLoading: healthLoading } = useHealthCheck();

  // User assets
  const { data: userAssets, isLoading: assetsLoading } = useUserAssets(address);
  console.log('User assets:', userAssets);

  // Asset info for selected token
  const { data: assetInfo, isLoading: assetInfoLoading } = useAssetInfo(
    selectedTokenId, 
    !!selectedTokenId
  );

  // Active loans
  const { data: activeLoans, isLoading: loansLoading } = useActiveLoans();

  // Mutations
  const mintAsset = useMintAsset();
  const fractionalizeAsset = useFractionalizeAsset();
  const createLoan = useCreateLoan();
  const approveToken = useApproveToken();

  const handleMintAsset = () => {
    if (!address) return;
    
    setApiMessage('Minting asset...');
    mintAsset.mutate(
      {
        to: address,
        ...mintForm
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            setApiMessage(`Asset minted successfully! Token ID: ${data.data?.tokenId}, TX: ${data.data?.txHash}`);
          } else {
            setApiMessage(`Mint failed: ${data.message}`);
          }
        },
        onError: (error) => {
          setApiMessage(`Mint error: ${error.message}`);
        }
      }
    );
  };

  const handleFractionalizeAsset = () => {
    if (!selectedTokenId) return;
    
    setApiMessage('Fractionalizing asset...');
    fractionalizeAsset.mutate(
      {
        tokenId: selectedTokenId,
        ...fractionForm
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            setApiMessage(`Asset fractionalized! Asset ID: ${data.data?.assetId}, TX: ${data.data?.txHash}`);
          } else {
            setApiMessage(`Fractionalization failed: ${data.message}`);
          }
        },
        onError: (error) => {
          setApiMessage(`Fractionalization error: ${error.message}`);
        }
      }
    );
  };

  const handleCreateLoan = () => {
    if (!selectedTokenId) return;
    
    setApiMessage('Creating loan...');
    createLoan.mutate(
      {
        ...loanForm,
        tokenId: selectedTokenId
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            setApiMessage(`Loan created! Loan ID: ${data.data?.loanId}, TX: ${data.data?.txHash}`);
          } else {
            setApiMessage(`Loan creation failed: ${data.message}`);
          }
        },
        onError: (error) => {
          setApiMessage(`Loan creation error: ${error.message}`);
        }
      }
    );
  };

  const handleApproveToken = () => {
    if (!address) return;
    
    setApiMessage('Approving token...');
    approveToken.mutate(
      tokenForm,
      {
        onSuccess: (data) => {
          if (data.success) {
            setApiMessage(`Token approved! TX: ${data.data?.txHash}`);
          } else {
            setApiMessage(`Token approval failed: ${data.message}`);
          }
        },
        onError: (error) => {
          setApiMessage(`Token approval error: ${error.message}`);
        }
      }
    );
  };

  if (!isConnected) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Please connect your wallet to use the API examples.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Bagel NFT DeFi API Examples</h1>
        <p className="text-gray-600 mb-4">
          This component demonstrates all the API endpoints available in the Bagel NFT DeFi platform.
        </p>
        
        {/* Connected Wallet Info */}
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong>Connected:</strong> {address}
        </div>
      </div>

      {/* Health Check */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-3">System Health</h2>
        {healthLoading ? (
          <div className="text-gray-500">Checking system health...</div>
        ) : (
          <div className={`p-3 rounded ${healthData?.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            Status: {healthData?.success ? 'Healthy' : 'Unhealthy'}
            {healthData?.message && <div>Message: {healthData.message}</div>}
          </div>
        )}
      </div>

      {/* User Assets */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-3">Your Assets</h2>
        {assetsLoading ? (
          <div className="text-gray-500">Loading your assets...</div>
        ) : userAssets?.success ? (
          <div>
            <div className="text-sm text-gray-600 mb-2">
              You own {userAssets.data?.length || 0} assets
            </div>
            {userAssets.data && userAssets.data.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {userAssets.data.map((tokenId) => (
                  <button
                    key={tokenId}
                    onClick={() => setSelectedTokenId(tokenId)}
                    className={`p-2 text-sm rounded border ${
                      selectedTokenId === tokenId 
                        ? 'bg-blue-100 border-blue-500' 
                        : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    Token #{tokenId}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No assets found</div>
            )}
          </div>
        ) : (
          <div className="text-red-600">Failed to load assets: {userAssets?.message}</div>
        )}
      </div>

      {/* Asset Info */}
      {selectedTokenId && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Asset Information (Token #{selectedTokenId})</h2>
          {assetInfoLoading ? (
            <div className="text-gray-500">Loading asset information...</div>
          ) : assetInfo?.success ? (
            <div className="space-y-2 text-sm">
              <div><strong>Owner:</strong> {assetInfo.data?.owner}</div>
              <div><strong>Type:</strong> {assetInfo.data?.assetType}</div>
              <div><strong>Location:</strong> {assetInfo.data?.physicalLocation}</div>
              <div><strong>Appraisal Value:</strong> ${parseInt(assetInfo.data?.appraisalValue || '0') / 1e18}</div>
              <div><strong>Custodian:</strong> {assetInfo.data?.custodian}</div>
              <div><strong>Authenticated:</strong> {assetInfo.data?.isAuthenticated ? '✅ Yes' : '❌ No'}</div>
              {assetInfo.data?.metadata && (
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <strong>Metadata:</strong>
                  <div>{assetInfo.data.metadata.name}</div>
                  <div className="text-xs text-gray-600">{assetInfo.data.metadata.description}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-600">Failed to load asset info: {assetInfo?.message}</div>
          )}
        </div>
      )}

      {/* Active Loans */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-3">Active Loans</h2>
        {loansLoading ? (
          <div className="text-gray-500">Loading active loans...</div>
        ) : activeLoans?.success ? (
          <div>
            <div className="text-sm text-gray-600 mb-2">
              {activeLoans.data?.length || 0} active loans found
            </div>
            {activeLoans.data && activeLoans.data.length > 0 ? (
              <div className="space-y-2">
                {activeLoans.data.slice(0, 3).map((loan) => (
                  <div key={loan.loanId} className="p-3 bg-gray-50 rounded text-sm">
                    <div><strong>Loan ID:</strong> {loan.loanId}</div>
                    <div><strong>Borrower:</strong> {loan.borrower.slice(0, 8)}...</div>
                    <div><strong>Amount:</strong> ${parseInt(loan.loanAmount) / 1e18}</div>
                    <div><strong>Status:</strong> {loan.status}</div>
                  </div>
                ))}
                {activeLoans.data.length > 3 && (
                  <div className="text-xs text-gray-500">... and {activeLoans.data.length - 3} more</div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">No active loans</div>
            )}
          </div>
        ) : (
          <div className="text-red-600">Failed to load loans: {activeLoans?.message}</div>
        )}
      </div>

      {/* Token ID Input */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-3">Selected Token ID</h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Token ID:</label>
          <input
            type="text"
            value={selectedTokenId}
            onChange={(e) => setSelectedTokenId(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
            placeholder="Enter token ID"
          />
        </div>
      </div>

      {/* API Actions with Forms */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-3">API Actions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Asset Management */}
          <div className="p-4 border rounded">
            <h3 className="font-medium mb-4">Asset Management - Mint NFT</h3>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium mb-1">Asset Type</label>
                <input
                  type="text"
                  value={mintForm.assetType}
                  onChange={(e) => setMintForm({...mintForm, assetType: e.target.value})}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="e.g., artwork, real-estate"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Physical Location</label>
                <input
                  type="text"
                  value={mintForm.physicalLocation}
                  onChange={(e) => setMintForm({...mintForm, physicalLocation: e.target.value})}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="Storage location"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Appraisal Value (USD)</label>
                <input
                  type="number"
                  value={mintForm.appraisalValueUSD}
                  onChange={(e) => setMintForm({...mintForm, appraisalValueUSD: Number(e.target.value)})}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Custodian</label>
                <input
                  type="text"
                  value={mintForm.custodian}
                  onChange={(e) => setMintForm({...mintForm, custodian: e.target.value})}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="Custodian organization"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Authenticity Cert Hash</label>
                <input
                  type="text"
                  value={mintForm.authenticityCertHash}
                  onChange={(e) => setMintForm({...mintForm, authenticityCertHash: e.target.value})}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Metadata URI</label>
                <input
                  type="text"
                  value={mintForm.metadataURI}
                  onChange={(e) => setMintForm({...mintForm, metadataURI: e.target.value})}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="ipfs://..."
                />
              </div>
            </div>
            <button
              onClick={handleMintAsset}
              disabled={mintAsset.isPending}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm"
            >
              {mintAsset.isPending ? 'Minting...' : 'Mint Asset NFT'}
            </button>
          </div>

          {/* Fractionalization */}
          <div className="p-4 border rounded">
            <h3 className="font-medium mb-4">Fractionalization</h3>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium mb-1">Fractional Supply</label>
                <input
                  type="text"
                  value={fractionForm.fractionalSupply}
                  onChange={(e) => setFractionForm({...fractionForm, fractionalSupply: e.target.value})}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="Total token supply"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Reserve Price (ETH)</label>
                <input
                  type="text"
                  value={fractionForm.reservePrice}
                  onChange={(e) => setFractionForm({...fractionForm, reservePrice: e.target.value})}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="Minimum redemption price"
                />
              </div>
            </div>
            <button
              onClick={handleFractionalizeAsset}
              disabled={fractionalizeAsset.isPending || !selectedTokenId}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 text-sm"
            >
              {fractionalizeAsset.isPending ? 'Fractionalizing...' : 'Fractionalize Asset'}
            </button>
          </div>

          {/* Lending */}
          <div className="p-4 border rounded">
            <h3 className="font-medium mb-4">Lending - Create Loan</h3>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium mb-1">Asset NFT Contract</label>
                <input
                  type="text"
                  value={loanForm.assetNftContract}
                  onChange={(e) => setLoanForm({...loanForm, assetNftContract: e.target.value})}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Loan Token Address</label>
                <input
                  type="text"
                  value={loanForm.loanTokenAddress}
                  onChange={(e) => setLoanForm({...loanForm, loanTokenAddress: e.target.value})}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Loan Amount</label>
                <input
                  type="number"
                  value={loanForm.amount}
                  onChange={(e) => setLoanForm({...loanForm, amount: Number(e.target.value)})}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Interest Rate (basis points)</label>
                <input
                  type="number"
                  value={loanForm.intrestRate}
                  onChange={(e) => setLoanForm({...loanForm, intrestRate: Number(e.target.value)})}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="500 = 5%"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Duration (seconds)</label>
                <input
                  type="number"
                  value={loanForm.duration}
                  onChange={(e) => setLoanForm({...loanForm, duration: Number(e.target.value)})}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="2592000 = 30 days"
                />
              </div>
            </div>
            <button
              onClick={handleCreateLoan}
              disabled={createLoan.isPending || !selectedTokenId}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 text-sm"
            >
              {createLoan.isPending ? 'Creating...' : 'Create Loan'}
            </button>
          </div>

          {/* Token Operations */}
          <div className="p-4 border rounded">
            <h3 className="font-medium mb-4">Token Operations - Approve</h3>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium mb-1">Token Address</label>
                <input
                  type="text"
                  value={tokenForm.tokenAddress}
                  onChange={(e) => setTokenForm({...tokenForm, tokenAddress: e.target.value})}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Amount</label>
                <input
                  type="number"
                  value={tokenForm.amount}
                  onChange={(e) => setTokenForm({...tokenForm, amount: Number(e.target.value)})}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Spender Address</label>
                <input
                  type="text"
                  value={tokenForm.spender}
                  onChange={(e) => setTokenForm({...tokenForm, spender: e.target.value})}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="0x..."
                />
              </div>
            </div>
            <button
              onClick={handleApproveToken}
              disabled={approveToken.isPending}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 text-sm"
            >
              {approveToken.isPending ? 'Approving...' : 'Approve Token'}
            </button>
          </div>
        </div>
      </div>

      {/* API Messages */}
      {apiMessage && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">API Response</h2>
          <div className="p-3 bg-gray-100 rounded text-sm font-mono break-all">
            {apiMessage}
          </div>
          <button
            onClick={() => setApiMessage('')}
            className="mt-2 px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-3">Additional Features</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <div>✅ <strong>36 total endpoints</strong> - All endpoints from the API integration guide</div>
          <div>✅ <strong>Full TypeScript support</strong> - Type-safe API calls and responses</div>
          <div>✅ <strong>React Query integration</strong> - Caching, background updates, and optimistic updates</div>
          <div>✅ <strong>Automatic error handling</strong> - Network errors, timeouts, and API errors</div>
          <div>✅ <strong>Request/Response logging</strong> - Debug mode with console logging</div>
          <div>✅ <strong>Configurable parameters</strong> - No hardcoded values, all user-configurable</div>
        </div>
      </div>
    </div>
  );
} 