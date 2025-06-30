'use client';

import { useState } from 'react';
import { useTransaction } from '@/hooks/useTransaction';
import { TransactionModal, TransactionStatus } from './TransactionModal';

// This is a demo component for testing the TransactionModal and confirmation tracking
export default function TransactionModalDemo() {
  const [testHash, setTestHash] = useState('');

  // Test transaction with confirmation tracking
  const testTransaction = useTransaction({
    title: 'Test Transaction',
    description: 'Testing confirmation tracking on Avalanche Fuji',
    requiredConfirmations: 2,
    onSuccess: () => {
      console.log('Test transaction confirmed successfully!');
    },
    onError: (error) => {
      console.error('Test transaction error:', error);
    }
  });

  const testStates = [
    { status: 'pending' as TransactionStatus, label: 'Pending' },
    { status: 'confirming' as TransactionStatus, label: 'Confirming' },
    { status: 'confirmed' as TransactionStatus, label: 'Confirmed' },
    { status: 'failed' as TransactionStatus, label: 'Failed' },
  ];

  const handleTestRealTransaction = () => {
    if (testHash.trim()) {
      testTransaction.startTransaction(testHash.trim());
    } else {
      alert('Please enter a valid transaction hash');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Transaction Modal & Confirmation Demo</h2>
      
      {/* Demo Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Static Demo States</h3>
        <div className="flex gap-2 flex-wrap">
          {testStates.map(({ status: testStatus, label }) => (
            <button
              key={testStatus}
              onClick={() => {
                testTransaction.reset();
                // Simulate different states for demo
                if (testStatus === 'pending') {
                  testTransaction.setTransactionPending();
                } else if (testStatus === 'failed') {
                  testTransaction.setTransactionError('Simulated transaction failure');
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Test {label}
            </button>
          ))}
        </div>
      </div>

      {/* Real Transaction Testing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Real Confirmation Tracking</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={testHash}
            onChange={(e) => setTestHash(e.target.value)}
            placeholder="Enter Avalanche Fuji transaction hash (0x...)"
            className="w-full px-3 py-2 border rounded-md"
          />
          <button
            onClick={handleTestRealTransaction}
            disabled={!testHash.trim() || testTransaction.isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test Real Transaction Confirmations
          </button>
        </div>
      </div>

      {/* Debug Information */}
      <div className="space-y-2 p-4 bg-gray-100 rounded-md">
        <h3 className="text-lg font-semibold">Debug Information</h3>
        <div className="text-sm space-y-1">
          <p><strong>Status:</strong> {testTransaction.status}</p>
          <p><strong>Chain ID:</strong> {testTransaction.chainId} ({testTransaction.chainName})</p>
          <p><strong>Connected Chain:</strong> {testTransaction.connectedChainId} ({testTransaction.connectedChainName})</p>
          <p><strong>Transaction Hash:</strong> {testTransaction.transactionHash || 'None'}</p>
          <p><strong>Confirmations:</strong> {testTransaction.confirmations}/{testTransaction.requiredConfirmations}</p>
          <p><strong>Is Loading:</strong> {testTransaction.isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Confirmation Loading:</strong> {testTransaction.isConfirmationLoading ? 'Yes' : 'No'}</p>
          <p><strong>Has Confirmation Data:</strong> {testTransaction.hasConfirmationData ? 'Yes' : 'No'}</p>
          <p><strong>Confirmation Fetched:</strong> {testTransaction.confirmationFetched ? 'Yes' : 'No'}</p>
          {testTransaction.error && <p><strong>Error:</strong> {testTransaction.error}</p>}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={testTransaction.reset}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Reset Test
      </button>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={testTransaction.isModalOpen}
        onClose={testTransaction.closeModal}
        status={testTransaction.status}
        hash={testTransaction.transactionHash}
        title={testTransaction.title}
        description={testTransaction.description}
        error={testTransaction.error}
        confirmations={testTransaction.confirmations}
        requiredConfirmations={testTransaction.requiredConfirmations}
      />
    </div>
  );
} 