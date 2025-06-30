'use client';

import Image from 'next/image';
import { MapPin, TrendingUp, Users, Calendar } from 'lucide-react';

interface CompactPropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    image: string;
    totalValue: string;
    expectedROI: string;
    tokensSold: number;
    totalTokens: number;
    daysLeft: number;
    isVerified: boolean;
    category: 'residential' | 'commercial' | 'industrial';
  };
}

export default function CompactPropertyCard({ property }: CompactPropertyCardProps) {
  const progress = (property.tokensSold / property.totalTokens) * 100;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'residential': return 'bg-blue-500/10 text-blue-500';
      case 'commercial': return 'bg-green-500/10 text-green-500';
      case 'industrial': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="bg-card border border-card-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 w-full max-w-sm mx-auto sm:max-w-none">
      {/* Compact Image */}
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-24 sm:h-28 lg:h-32 object-cover"
        />
        
        {/* Compact Badges */}
        <div className="absolute top-1 sm:top-1.5 left-1 sm:left-1.5 flex gap-1">
          <div className={`px-1 sm:px-1.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(property.category)}`}>
            {property.category.charAt(0).toUpperCase() + property.category.slice(1)}
          </div>
          {property.isVerified && (
            <div className="bg-green-500 text-white px-1 py-0.5 rounded-full text-xs flex items-center">
              ✓
            </div>
          )}
        </div>

        {/* Progress Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1 sm:p-1.5">
          <div className="w-full bg-white/20 rounded-full h-1">
            <div 
              className="bg-accent h-1 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-white text-xs mt-0.5">
            <span>{Math.round(progress)}% funded</span>
            <span>{property.daysLeft}d left</span>
          </div>
        </div>
      </div>

      {/* Compact Content */}
      <div className="p-2.5 sm:p-3 space-y-2 sm:space-y-2.5">
        {/* Title and Location */}
        <div>
          <h3 className="font-semibold text-xs sm:text-sm lg:text-base line-clamp-1 mb-0.5">{property.title}</h3>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
            <span className="text-xs truncate">{property.location}</span>
          </div>
        </div>

        {/* Compact Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>Value</span>
            </div>
            <div className="font-semibold text-foreground text-xs sm:text-sm">{property.totalValue}</div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>ROI</span>
            </div>
            <div className="font-semibold text-accent text-xs sm:text-sm">{property.expectedROI}</div>
          </div>
        </div>

        {/* Compact Investment Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-2.5 h-2.5" />
              Investors
            </span>
            <span>{property.tokensSold.toLocaleString()} / {property.totalTokens.toLocaleString()}</span>
          </div>
        </div>

        {/* Compact Action Button */}
        <button className="w-full bg-accent text-accent-foreground font-medium py-1.5 sm:py-2 rounded-md text-xs sm:text-sm hover:opacity-90 transition-opacity">
          Invest Now
        </button>
      </div>
    </div>
  );
} 