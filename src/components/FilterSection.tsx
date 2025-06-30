'use client';

import { ChevronDown, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FilterSection() {
  const filterOptions = [
    { label: 'Property Type', placeholder: 'Select type' },
    { label: 'Expected ROI', placeholder: 'Select ROI' },
    { label: 'Investment Duration', placeholder: 'Select duration' },
  ];

  return (
    <div className="w-full max-w-[737px] mx-auto px-3 sm:px-4 lg:px-0">
      {/* Mobile Layout */}
      <div className="sm:hidden space-y-2">
        {/* Top row - two filters */}
        <div className="grid grid-cols-2 gap-2">
          {filterOptions.slice(0, 2).map((option, index) => (
            <div
              key={option.label}
              className="bg-card border border-card-border rounded-lg p-2.5 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-all"
            >
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <div className="text-muted-foreground font-manrope font-semibold text-xs tracking-[-0.01em] truncate">
                  {option.label}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>
          ))}
        </div>
        
        {/* Bottom row - third filter and filters button */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-card border border-card-border rounded-lg p-2.5 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-all">
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <div className="text-muted-foreground font-manrope font-semibold text-xs tracking-[-0.01em] truncate">
                {filterOptions[2].label}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </div>
          
          {/* Filters Button */}
          <div className="bg-card border border-card-border rounded-lg p-2.5 flex items-center justify-center cursor-pointer hover:bg-muted/30 transition-all">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground font-medium text-xs">
                Filters
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex flex-col md:flex-row items-stretch md:items-center justify-center gap-3">
        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full md:w-auto">
          {filterOptions.map((option, index) => (
            <div
              key={option.label}
              className="bg-card border border-card-border rounded-md p-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-all w-full md:w-[180px] lg:w-[199px]"
            >
              <div className="flex flex-col gap-1">
                <div className="text-muted-foreground font-manrope font-semibold text-sm tracking-[-0.01em]">
                  {option.label}
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </div>
          ))}
        </div>

        {/* Filters Button */}
        <div className="bg-card border border-card-border rounded-md p-3 flex items-center justify-center cursor-pointer hover:bg-muted/30 transition-all w-full md:w-[105px]">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground font-medium text-sm">
              Filters
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 