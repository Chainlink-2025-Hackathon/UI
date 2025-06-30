'use client';

import { Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  const footerLinks = [
    {
      title: 'PLATFORM',
      links: ['Asset Listings', 'Portfolio', 'Fractionalization']
    },
    {
      title: 'SERVICES',
      links: ['Tokenization', 'Loans', 'Auctions']
    },
    {
      title: 'LEARN MORE',
      links: ['Docs', 'Chainlink Integration', 'How It Works']
    }
  ];

  return (
    <footer className="bg-background border-t border-card-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-[104px] py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 sm:gap-12 lg:gap-24">
          {/* Footer Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-30 w-full lg:w-auto">
            {footerLinks.map((section) => (
              <div key={section.title} className="flex flex-col gap-4 sm:gap-6">
                <h3 className="text-muted-foreground font-manrope font-medium text-xs tracking-[0.12em] uppercase">
                  {section.title}
                </h3>
                <div className="flex flex-col gap-3 sm:gap-4">
                  {section.links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="text-muted-foreground hover:text-foreground font-manrope text-sm transition-colors"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 w-full lg:w-auto lg:min-w-[320px]">
            <div className="flex flex-col gap-3">
              <h3 className="text-muted-foreground font-manrope font-medium text-xs tracking-[0.12em] uppercase">
                RWA PLATFORM
              </h3>
              <p className="text-muted-foreground font-manrope font-medium text-xs max-w-full lg:max-w-[300px]">
                Get updates on new tokenized assets, market insights and platform developments.
              </p>
            </div>

            {/* Email Input */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-primary/20 border-b border-card-border rounded-none">
              <div className="flex items-center gap-2 px-2 py-3 flex-1">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="bg-transparent text-muted-foreground font-manrope font-medium text-sm placeholder:text-muted-foreground outline-none flex-1 min-w-0"
                />
              </div>
              <button className="bg-accent text-accent-foreground font-medium px-5 py-2 sm:py-2 rounded-sm text-sm hover:opacity-90 transition-opacity w-full sm:w-auto">
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-card-border/10 via-card-border/50 to-card-border/10 my-8 sm:my-12"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-muted-foreground font-manrope font-medium text-sm order-2 sm:order-1">
            © 2025 RWA Protocol.
          </div>

          {/* Social Links */}
          <div className="flex gap-6 sm:gap-8 order-1 sm:order-2">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Instagram className="w-5 sm:w-6 h-5 sm:h-6" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Facebook className="w-5 sm:w-6 h-5 sm:h-6" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-5 sm:w-6 h-5 sm:h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 