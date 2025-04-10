import { createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { injected, metaMask } from "wagmi/connectors"

// Configure wagmi with the chains and connectors
// Removing WalletConnect entirely to avoid EventEmitter2 dependency
export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected(),
    metaMask(),
    // WalletConnect removed to avoid EventEmitter2 dependency
  ],
})
