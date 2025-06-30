'use client';

import { PortfolioInterface } from '@/components/portfolio';
import { useWallet } from '@/hooks/useWallet';
import { PieChart } from 'lucide-react';

export default function FractionalizedPage() {
  const { address } = useWallet();

  return (
    <>
      {/* Feature Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-3">
          <PieChart className="w-7 h-7 text-purple-500" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Portfolio Management</h1>
            <p className="text-muted-foreground">Comprehensive view of all your assets, loans, and activities</p>
          </div>
        </div>
      </div>

      {/* Feature Content */}
      <div className="max-w-full">
        <PortfolioInterface userAddress={address} />
      </div>
    </>
  );
} 