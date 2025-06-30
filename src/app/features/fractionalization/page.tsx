'use client';

import { useState } from 'react';
import FractionalizationInterface from '@/components/fractionalization/FractionalizationInterface';
import { PieChart } from 'lucide-react';

export default function FractionalizationPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for component
  const sampleAssetData = {
    id: '1',
    title: 'Vintage Picasso Painting',
    image: '/api/placeholder/400/300',
    currentValue: '2,500,000',
    isOwner: true,
    isFractionalized: false,
    totalFractions: 10000,
    ownedFractions: 2500
  };

  const handleFractionalize = (fractionCount: number, pricePerFraction: string) => {
    setIsLoading(true);
    console.log('Fractionalizing asset:', { fractionCount, pricePerFraction });
    setTimeout(() => {
      setIsLoading(false);
      alert('Asset fractionalized successfully! (Demo)');
    }, 2000);
  };

  const handleUnlock = () => {
    setIsLoading(true);
    console.log('Unlocking asset');
    setTimeout(() => {
      setIsLoading(false);
      alert('Unlock process initiated! (Demo)');
    }, 2000);
  };

  return (
    <>
      {/* Feature Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-3">
          <PieChart className="w-7 h-7 text-purple-500" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Fractionalization</h1>
            <p className="text-muted-foreground">Split asset ownership into fractional shares</p>
          </div>
        </div>
      </div>

      {/* Feature Content */}
      <div className="max-w-6xl">
        <FractionalizationInterface 
          assetData={sampleAssetData}
          onFractionalize={handleFractionalize}
          onUnlock={handleUnlock}
          isLoading={isLoading}
        />
      </div>
    </>
  );
} 