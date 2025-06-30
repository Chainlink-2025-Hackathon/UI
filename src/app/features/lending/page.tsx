'use client';

import { useState } from 'react';
import LendingInterface from '@/components/lending/LendingInterface';
import { DollarSign } from 'lucide-react';

export default function LendingPage() {
  const handleLoanCreated = (loanId: string) => {
    console.log('Loan created with ID:', loanId);
    // You can add success notification or redirect logic here
  };

  return (
    <>
      {/* Feature Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-3">
          <DollarSign className="w-7 h-7 text-yellow-500" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Asset-Backed Lending</h1>
            <p className="text-muted-foreground">Use your NFT assets as collateral for loans</p>
          </div>
        </div>
      </div>

      {/* Feature Content */}
      <div className="max-w-6xl">
        <LendingInterface 
          onLoanCreated={handleLoanCreated}
        />
      </div>
    </>
  );
} 