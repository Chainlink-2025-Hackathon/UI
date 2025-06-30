'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FeaturesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to tokenization as the default feature
    router.replace('/features/tokenization');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading features...</p>
      </div>
    </div>
  );
} 