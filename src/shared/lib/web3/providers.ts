import { ethers } from 'ethers'

/**
 * Get a JSON RPC provider for the specified network
 */
export function getJsonRpcProvider(rpcUrl: string): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(rpcUrl)
}

/**
 * Default providers configuration for common networks
 */
export const NETWORK_PROVIDERS = {
  ethereum: {
    mainnet: 'https://eth-mainnet.g.alchemy.com/v2/' + (process.env.ALCHEMY_API_KEY || ''),
    goerli: 'https://eth-goerli.g.alchemy.com/v2/' + (process.env.ALCHEMY_API_KEY || ''),
  },
  polygon: {
    mainnet: 'https://polygon-mainnet.g.alchemy.com/v2/' + (process.env.ALCHEMY_API_KEY || ''),
    mumbai: 'https://polygon-mumbai.g.alchemy.com/v2/' + (process.env.ALCHEMY_API_KEY || ''),
  },
} 