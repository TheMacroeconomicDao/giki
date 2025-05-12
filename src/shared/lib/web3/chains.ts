/**
 * Chain configuration
 */
export interface ChainConfig {
  id: number
  name: string
  currency: string
  symbol: string
  decimals: number
  blockExplorer: string
}

/**
 * Common chain configurations
 */
export const CHAINS: Record<string, ChainConfig> = {
  // Ethereum Mainnet
  ethereum: {
    id: 1,
    name: 'Ethereum Mainnet',
    currency: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    blockExplorer: 'https://etherscan.io',
  },
  
  // Ethereum Goerli Testnet
  goerli: {
    id: 5,
    name: 'Goerli Testnet',
    currency: 'Goerli Ether',
    symbol: 'ETH',
    decimals: 18,
    blockExplorer: 'https://goerli.etherscan.io',
  },
  
  // Polygon Mainnet
  polygon: {
    id: 137,
    name: 'Polygon Mainnet',
    currency: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
    blockExplorer: 'https://polygonscan.com',
  },
  
  // Mumbai Testnet
  mumbai: {
    id: 80001,
    name: 'Mumbai Testnet',
    currency: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
    blockExplorer: 'https://mumbai.polygonscan.com',
  },
} 