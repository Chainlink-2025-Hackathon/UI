import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon, arbitrum, base, avalancheFuji } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

// WalletConnect project ID - Get from https://cloud.walletconnect.com/
// For now, we'll disable WalletConnect to prevent connection errors
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, arbitrum, base, avalancheFuji],
  connectors: [
    injected(),
    metaMask(),
    // Only include WalletConnect if we have a valid project ID
    ...(projectId ? [walletConnect({ projectId })] : []),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [avalancheFuji.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
} 