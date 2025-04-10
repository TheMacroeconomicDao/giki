// Simple wallet connection utilities without Wagmi

// Types for our wallet connection
export type WalletInfo = {
  address: string | null
  isConnected: boolean
  chainId: number | null
  connector: "metamask" | "injected" | null
}

// Check if window.ethereum is available
export const isMetaMaskAvailable = (): boolean => {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined"
}

// Connect to MetaMask
export const connectMetaMask = async (): Promise<WalletInfo> => {
  if (!isMetaMaskAvailable()) {
    throw new Error("MetaMask is not available")
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    const chainId = await window.ethereum.request({ method: "eth_chainId" })

    return {
      address: accounts[0],
      isConnected: true,
      chainId: Number.parseInt(chainId, 16),
      connector: "metamask",
    }
  } catch (error) {
    console.error("Error connecting to MetaMask:", error)
    throw error
  }
}

// Get current accounts (if already connected)
export const getCurrentWallet = async (): Promise<WalletInfo> => {
  if (!isMetaMaskAvailable()) {
    return {
      address: null,
      isConnected: false,
      chainId: null,
      connector: null,
    }
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" })
    if (accounts.length === 0) {
      return {
        address: null,
        isConnected: false,
        chainId: null,
        connector: null,
      }
    }

    const chainId = await window.ethereum.request({ method: "eth_chainId" })

    return {
      address: accounts[0],
      isConnected: true,
      chainId: Number.parseInt(chainId, 16),
      connector: "metamask",
    }
  } catch (error) {
    console.error("Error getting current wallet:", error)
    return {
      address: null,
      isConnected: false,
      chainId: null,
      connector: null,
    }
  }
}

// Sign a message with MetaMask
export const signMessage = async (message: string, address: string): Promise<string> => {
  if (!isMetaMaskAvailable()) {
    throw new Error("MetaMask is not available")
  }

  try {
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [message, address],
    })

    return signature
  } catch (error) {
    console.error("Error signing message:", error)
    throw error
  }
}

// Disconnect (this is a client-side only operation)
export const disconnectWallet = (): void => {
  // MetaMask doesn't have a disconnect method
  // We just clear our local state
  console.log("Wallet disconnected (client-side only)")
}

// Format address for display
export const formatAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

// Get Etherscan link for address
export const getEtherscanLink = (address: string): string => {
  return `https://etherscan.io/address/${address}`
}

// Add event listeners for account and chain changes
export const setupWalletListeners = (
  onAccountsChanged: (accounts: string[]) => void,
  onChainChanged: (chainId: string) => void,
): (() => void) => {
  if (!isMetaMaskAvailable()) {
    return () => {}
  }

  window.ethereum.on("accountsChanged", onAccountsChanged)
  window.ethereum.on("chainChanged", onChainChanged)

  // Return cleanup function
  return () => {
    window.ethereum.removeListener("accountsChanged", onAccountsChanged)
    window.ethereum.removeListener("chainChanged", onChainChanged)
  }
}

// Add window.ethereum type definition
declare global {
  interface Window {
    ethereum: any
  }
}
