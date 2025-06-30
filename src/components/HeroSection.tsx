'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home, Building, Factory, Palette, Gem, Car } from 'lucide-react';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const assetTypes = [
    {
      id: 1,
      title: "Residential Properties",
      description: "Luxury homes and apartments in prime locations",
      image: "/api/placeholder/600/400",
      icon: Home,
      stats: { value: "$2.5M+", properties: "150+", roi: "12-18%" },
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      id: 2,
      title: "Commercial Real Estate",
      description: "Office buildings, retail spaces, and business centers",
      image: "/api/placeholder/600/400",
      icon: Building,
      stats: { value: "$5.2M+", properties: "85+", roi: "15-22%" },
      color: "from-green-500/20 to-green-600/20"
    },
    {
      id: 3,
      title: "Industrial Assets",
      description: "Warehouses, manufacturing facilities, and logistics centers",
      image: "/api/placeholder/600/400",
      icon: Factory,
      stats: { value: "$8.1M+", properties: "45+", roi: "18-25%" },
      color: "from-orange-500/20 to-orange-600/20"
    },
    {
      id: 4,
      title: "Art & Collectibles",
      description: "Fine art, rare collectibles, and luxury items",
      image: "/api/placeholder/600/400",
      icon: Palette,
      stats: { value: "$1.8M+", properties: "200+", roi: "20-35%" },
      color: "from-purple-500/20 to-purple-600/20"
    },
    {
      id: 5,
      title: "Precious Metals",
      description: "Gold, silver, platinum, and other valuable metals",
      image: "/api/placeholder/600/400",
      icon: Gem,
      stats: { value: "$3.2M+", properties: "120+", roi: "8-15%" },
      color: "from-yellow-500/20 to-yellow-600/20"
    },
    {
      id: 6,
      title: "Luxury Vehicles",
      description: "Classic cars, supercars, and rare automotive assets",
      image: "/api/placeholder/600/400",
      icon: Car,
      stats: { value: "$4.5M+", properties: "75+", roi: "10-20%" },
      color: "from-red-500/20 to-red-600/20"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % assetTypes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [assetTypes.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % assetTypes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + assetTypes.length) % assetTypes.length);
  };

  const currentAsset = assetTypes[currentSlide];
  const IconComponent = currentAsset.icon;

  return (
    <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-[104px] py-8 sm:py-12">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-gradient-to-r from-background/90 via-background/70 to-background/40 dark:from-background/90 dark:via-background/70 dark:to-background/40">
          <img 
            src="/api/placeholder/1400/560" 
            alt="Hero Background"
            className="w-full h-full object-cover opacity-30 dark:opacity-40"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 min-h-[400px] sm:min-h-[480px] lg:h-[480px]">
        {/* Welcome Message */}
        <div className="flex flex-col gap-6 sm:gap-8 max-w-full lg:max-w-[600px] text-center lg:text-left">
          <div className="space-y-4 sm:space-y-6">
            <div className="hero-text-muted font-manrope font-semibold text-xs sm:text-sm lg:text-[15px] tracking-[0.15em] sm:tracking-[0.2em] leading-relaxed sm:leading-[3.27em]">
              REAL WORLD ASSET TOKENIZATION
            </div>
            <h1 className="hero-text font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] leading-tight sm:leading-[1.2em] lg:leading-[1.12em] tracking-tight sm:tracking-[-0.03em]">
              Tokenize, Fractionalize & Trade Real World Assets
            </h1>
            <p className="text-muted-foreground font-manrope text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Unlock liquidity from commodities, arts, and real estate through blockchain tokenization. 
              Powered by Chainlink oracles for secure asset verification, cross-chain capabilities, and automated loan liquidations.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6 justify-center lg:justify-start">
              <span className="px-3 py-1 bg-accent/20 text-accent-foreground rounded-full text-xs sm:text-sm font-medium">
                Fractionalization
              </span>
              <span className="px-3 py-1 bg-accent/20 text-accent-foreground rounded-full text-xs sm:text-sm font-medium">
                Asset-Backed Loans
              </span>
              <span className="px-3 py-1 bg-accent/20 text-accent-foreground rounded-full text-xs sm:text-sm font-medium">
                Auction Liquidation
              </span>
              <span className="px-3 py-1 bg-accent/20 text-accent-foreground rounded-full text-xs sm:text-sm font-medium">
                Chainlink Powered
              </span>
            </div>
          </div>
        </div>

        {/* Asset Carousel */}
        <div className="w-full lg:w-auto lg:flex-shrink-0 lg:max-w-[520px] xl:max-w-[652px]">
          <div className="relative bg-card/50 backdrop-blur-sm border border-card-border rounded-xl overflow-hidden shadow-2xl">
            {/* Carousel Container */}
            <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {assetTypes.map((asset, index) => (
                  <div key={asset.id} className="w-full flex-shrink-0 relative">
                    <img 
                      src={asset.image} 
                      alt={asset.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${asset.color} to-transparent`} />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 text-foreground p-1.5 sm:p-2 rounded-full transition-all shadow-lg"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 text-foreground p-1.5 sm:p-2 rounded-full transition-all shadow-lg"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Asset Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-accent/20 p-2 sm:p-3 rounded-lg">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-foreground mb-1">
                    {currentAsset.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                    {currentAsset.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Total Value</div>
                      <div className="font-semibold text-xs sm:text-sm text-accent">{currentAsset.stats.value}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Assets</div>
                      <div className="font-semibold text-xs sm:text-sm text-foreground">{currentAsset.stats.properties}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">ROI Range</div>
                      <div className="font-semibold text-xs sm:text-sm text-green-500">{currentAsset.stats.roi}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-1.5">
              {assetTypes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-accent scale-110' 
                      : 'bg-background/50 hover:bg-background/70'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Explore Button */}
          <div className="mt-4 sm:mt-6 text-center">
            <button className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-all shadow-lg hover:shadow-xl">
              Explore All Assets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 