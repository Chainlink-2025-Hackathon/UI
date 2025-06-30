'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 hover:scale-105 bg-card border border-card-border hover:bg-muted/30"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {/* Sun Icon */}
      <Sun 
        className={`w-5 h-5 transition-all duration-300 ${
          theme === 'light' 
            ? "opacity-100 rotate-0 scale-100" 
            : "opacity-0 rotate-90 scale-0"
        } text-amber-500 absolute`}
      />
      
      {/* Moon Icon */}
      <Moon 
        className={`w-5 h-5 transition-all duration-300 ${
          theme === 'dark' 
            ? "opacity-100 rotate-0 scale-100" 
            : "opacity-0 -rotate-90 scale-0"
        } text-blue-400 absolute`}
      />
    </button>
  );
} 