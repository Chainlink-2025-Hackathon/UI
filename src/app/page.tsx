'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AssetCategoryShowcase from '@/components/AssetCategoryShowcase';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Main Content with top padding for floating nav */}
      <div className="pt-20 sm:pt-24 lg:pt-28">
        {/* Hero Section */}
        <HeroSection />

        {/* Asset Category Showcase */}
        <AssetCategoryShowcase />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
