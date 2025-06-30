'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortfolioPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the actual portfolio interface location
    router.replace('/features/fractionalized');
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Redirecting to Portfolio...</h1>
        <p className="text-muted-foreground">Taking you to your comprehensive portfolio view</p>
      </div>
    </div>
  );
} 