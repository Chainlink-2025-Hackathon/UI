'use client';

import Image from 'next/image';
import { MapPin, TrendingUp, Users, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: {
    id: string | number;
    title: string;
    location: string;
    image: string;
    totalValue?: string;
    pricePerToken?: string;
    expectedROI?: string;
    tokensSold?: number;
    totalTokens?: number;
    participantCount?: number;
    daysLeft?: number;
    isVerified?: boolean;
    isFeatured?: boolean;
    category?: 'residential' | 'commercial' | 'industrial';
    status?: 'active' | 'upcoming' | 'sold-out';
    // Legacy support for hero section
    minimumInvestment?: string;
    units?: string;
    duration?: string;
    description?: string;
    featured?: boolean;
  };
  variant?: 'default' | 'featured';
  className?: string;
}

export default function PropertyCard({ property, variant = 'default', className }: PropertyCardProps) {
  // Handle both new and legacy property formats
  const tokensSold = property.tokensSold || 0;
  const totalTokens = property.totalTokens || parseInt(property.units || '100');
  const progress = totalTokens > 0 ? (tokensSold / totalTokens) * 100 : 0;
  const status = property.status || 'active';
  const category = property.category || 'residential';
  const isVerified = property.isVerified || false;
  const isFeatured = property.isFeatured || property.featured || false;
  const participantCount = property.participantCount || 0;
  const daysLeft = property.daysLeft || parseInt(property.duration?.split(' ')[0] || '30');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500';
      case 'upcoming': return 'bg-blue-500/10 text-blue-500';
      case 'sold-out': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'residential': return 'bg-blue-500/10 text-blue-500';
      case 'commercial': return 'bg-green-500/10 text-green-500';
      case 'industrial': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className={cn(
      "bg-card border border-card-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300",
      variant === 'featured' && "shadow-xl border-accent/20",
      className
    )}>
      {/* Property Image */}
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.title}
          className={cn(
            "w-full object-cover",
            variant === 'featured' ? "h-48 sm:h-56 lg:h-64" : "h-32 sm:h-40 lg:h-48"
          )}
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 flex flex-wrap gap-1">
          {isFeatured && (
            <div className="bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full text-xs font-medium">
              Featured
            </div>
          )}
          {isVerified && (
            <div className="bg-green-500 text-white px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Verified</span>
            </div>
          )}
        </div>

        <div className={`absolute top-1.5 sm:top-2 right-1.5 sm:right-2 px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 flex gap-1">
          <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className={cn(
        "space-y-3 sm:space-y-4",
        variant === 'featured' ? "p-4 sm:p-5 lg:p-6" : "p-3 sm:p-4"
      )}>
        {/* Title and Location */}
        <div>
          <h3 className={cn(
            "font-semibold mb-1 line-clamp-1",
            variant === 'featured' ? "text-base sm:text-lg lg:text-xl" : "text-sm sm:text-base lg:text-lg"
          )}>
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="text-xs sm:text-sm truncate">{property.location}</span>
          </div>
        </div>

        {/* Description for featured variant */}
        {variant === 'featured' && property.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {property.description}
          </p>
        )}

        {/* Progress Bar */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Funding Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-accent h-1.5 sm:h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{tokensSold.toLocaleString()} / {totalTokens.toLocaleString()} tokens</span>
            <span>{participantCount} investors</span>
          </div>
        </div>

        {/* Investment Details */}
        <div className={cn(
          "gap-2 sm:gap-3 text-center sm:text-left",
          variant === 'featured' ? "grid grid-cols-2 lg:grid-cols-4" : "grid grid-cols-2 sm:grid-cols-4"
        )}>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {property.totalValue ? 'Total Value' : 'Min Investment'}
              </span>
            </div>
            <p className="font-semibold text-xs sm:text-sm text-foreground">
              {property.totalValue || property.minimumInvestment || 'N/A'}
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Per Token</span>
            </div>
            <p className="font-semibold text-xs sm:text-sm text-accent">
              {property.pricePerToken || 'N/A'}
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Expected ROI</span>
            </div>
            <p className="font-semibold text-xs sm:text-sm text-green-500">
              {property.expectedROI || 'N/A'}
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Time Left</span>
            </div>
            <p className="font-semibold text-xs sm:text-sm text-foreground">
              {daysLeft}d
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className={cn(
            "w-full bg-accent text-accent-foreground font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50",
            variant === 'featured' ? "py-3 sm:py-3.5 text-sm sm:text-base" : "py-2 sm:py-2.5 lg:py-3 text-sm"
          )}
          disabled={status === 'sold-out'}
        >
          {status === 'sold-out' ? 'Sold Out' : 
           status === 'upcoming' ? 'Coming Soon' : 'Invest Now'}
        </button>
      </div>
    </div>
  );
}

// Ensure proper module export
export { PropertyCard }; 