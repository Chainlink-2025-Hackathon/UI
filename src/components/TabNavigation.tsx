'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TabNavigationProps {
  onTabChange?: (tab: string) => void;
  defaultTab?: string;
}

export default function TabNavigation({ onTabChange, defaultTab = 'PROPERTIES' }: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = ['PROPERTIES', 'INVESTMENT TRUST'];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="flex items-center justify-center w-full max-w-[737px] mx-auto px-3 sm:px-4 lg:px-0">
      <div className="bg-card rounded-full p-1 sm:p-1.5 lg:p-2 flex items-center gap-1 sm:gap-2 lg:gap-4 border border-card-border w-full sm:w-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-2.5 sm:px-3 lg:px-5 py-1.5 sm:py-2 lg:py-3 rounded-full font-manrope font-semibold text-xs sm:text-sm tracking-[0.11em] transition-all duration-200 flex-1 sm:flex-none min-w-0 ${
              activeTab === tab
                ? "bg-accent text-accent-foreground"
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
            }`}
          >
            <span className="truncate">{tab}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 