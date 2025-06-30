import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import WalletProvider from "@/components/wallet/WalletProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RWA Protocol - Real World Asset Tokenization Platform",
  description: "Tokenize, fractionalize and trade real world assets including commodities, arts, and real estate. Powered by Chainlink oracles for secure asset verification and cross-chain capabilities.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${manrope.variable} antialiased bg-background text-foreground`}
      >
        <WalletProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
