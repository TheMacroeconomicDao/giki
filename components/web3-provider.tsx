"use client"

import type React from "react"

import { createContext, useEffect, useState, useCallback } from "react"
import { ethers } from "ethers"
import { useToast } from "@/hooks/use-toast"

interface Web3ContextType {
  address: string | null
  isConnected: boolean
  connect: (walletType?: 'metamask' | 'walletconnect' | 'coinbase') => Promise<string>
  disconnect: () => void
  signMessage: (message: string) => Promise<string>
  chainId: number | null
  switchChain: (chainId: number) => Promise<boolean>
  walletType: string | null
}

export const Web3Context = createContext<Web3ContextType>({
  address: null,
  isConnected: false,
  connect: async () => "",
  disconnect: () => {},
  signMessage: async () => "",
  chainId: null,
  switchChain: async () => false,
  walletType: null
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [walletType, setWalletType] = useState<string | null>(null)
  const { toast } = useToast()

  // Handle account and chain changes
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnect()
    } else if (accounts[0] !== address) {
      // Account changed
      setAddress(accounts[0])
      localStorage.setItem("walletAddress", accounts[0])
      
      toast({
        title: "Wallet Changed",
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      })
    }
  }, [address])

  const handleChainChanged = useCallback((chainIdHex: string) => {
    const newChainId = parseInt(chainIdHex, 16)
    setChainId(newChainId)
    
    toast({
      title: "Network Changed",
      description: `Switched to chain ID: ${newChainId}`,
    })
    
    // Refresh the page to make sure everything is updated properly
    window.location.reload()
  }, [])

  const handleDisconnect = useCallback(() => {
    disconnect()
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }, [])

  // Initialize event listeners for wallet
  const setupEventListeners = useCallback(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      // Remove any existing listeners
      window.ethereum.removeAllListeners("accountsChanged")
      window.ethereum.removeAllListeners("chainChanged")
      window.ethereum.removeAllListeners("disconnect")
      
      // Add new listeners
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
      window.ethereum.on("disconnect", handleDisconnect)
      
      // Get current chain ID
      window.ethereum.request({ method: "eth_chainId" })
        .then((chainIdHex: string) => {
          setChainId(parseInt(chainIdHex, 16))
        })
        .catch(console.error)
    }
  }, [handleAccountsChanged, handleChainChanged, handleDisconnect])

  useEffect(() => {
    // Check if user was previously connected
    const wasConnected = localStorage.getItem("walletConnected") === "true"
    const savedAddress = localStorage.getItem("walletAddress")
    const savedWalletType = localStorage.getItem("walletType")

    if (wasConnected && savedAddress) {
      setAddress(savedAddress)
      setIsConnected(true)
      setWalletType(savedWalletType)

      // Initialize provider if window.ethereum is available
      if (typeof window !== "undefined" && window.ethereum) {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum)
        setProvider(ethersProvider)
        setupEventListeners()
      }
    }
    
    // Cleanup event listeners
    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
        window.ethereum.removeAllListeners("chainChanged")
        window.ethereum.removeAllListeners("disconnect")
      }
    }
  }, [setupEventListeners])

  const connect = async (walletType = 'metamask'): Promise<string> => {
    try {
      // Check if MetaMask is installed for MetaMask option
      if (walletType === 'metamask' && typeof window !== "undefined" && window.ethereum) {
        // Create a new provider
        const ethersProvider = new ethers.BrowserProvider(window.ethereum)
        setProvider(ethersProvider)

        // Request account access
        const accounts = await ethersProvider.send("eth_requestAccounts", [])
        const connectedAddress = accounts[0]

        // Get current chain ID
        const chainIdHex = await window.ethereum.request({ method: "eth_chainId" })
        setChainId(parseInt(chainIdHex, 16))
        
        // Setup event listeners
        setupEventListeners()

        // Update state
        setAddress(connectedAddress)
        setIsConnected(true)
        setWalletType('metamask')
        
        // Save to localStorage
        localStorage.setItem("walletConnected", "true")
        localStorage.setItem("walletAddress", connectedAddress)
        localStorage.setItem("walletType", 'metamask')

        toast({
          title: "Wallet Connected",
          description: `Connected to MetaMask: ${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`,
        })

        return connectedAddress
      }
      
      // For WalletConnect and other wallets, in a real implementation you would:
      // 1. Import WalletConnect SDK
      // 2. Initialize a provider
      // 3. Connect with the appropriate provider
      
      // Mock implementation for development
      console.log(`Mock connection to ${walletType}`)
      const mockAddress = "0x" + Math.random().toString(16).slice(2, 42)
      setAddress(mockAddress)
      setIsConnected(true)
      setWalletType(walletType)
      setChainId(1) // Mock Ethereum mainnet
      
      // Save to localStorage
      localStorage.setItem("walletConnected", "true")
      localStorage.setItem("walletAddress", mockAddress)
      localStorage.setItem("walletType", walletType)
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${walletType}: ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
      })

      return mockAddress
    } catch (error) {
      console.error("Connection error:", error)
      
      toast({
        title: "Connection Failed",
        description: (error as Error)?.message || "Could not connect to wallet",
        variant: "destructive"
      })
      
      throw error
    }
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
    setProvider(null)
    setChainId(null)
    setWalletType(null)
    
    // Clear localStorage
    localStorage.removeItem("walletConnected")
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletType")
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
  }

  const signMessage = async (message: string): Promise<string> => {
    try {
      if (!isConnected || !address) {
        throw new Error("Wallet not connected")
      }

      // If we have a real provider, use it to sign
      if (provider) {
        const signer = await provider.getSigner()
        return await signer.signMessage(message)
      }

      // Mock implementation for development
      console.log("Mock signing message:", message)
      return `0x${Array.from({ length: 130 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
    } catch (error) {
      console.error("Signing error:", error)
      
      toast({
        title: "Signing Failed",
        description: (error as Error)?.message || "Could not sign message",
        variant: "destructive"
      })
      
      throw error
    }
  }
  
  const switchChain = async (targetChainId: number): Promise<boolean> => {
    try {
      if (!isConnected || !provider) {
        throw new Error("Wallet not connected")
      }
      
      // For MetaMask
      if (typeof window !== "undefined" && window.ethereum) {
        const chainIdHex = `0x${targetChainId.toString(16)}`
        
        // Try to switch to the chain
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainIdHex }],
          })
          
          // Chain was already added, just switched
          setChainId(targetChainId)
          return true
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            // In a real app, you would add the chain to wallet here
            // For this MVP, just throw an error
            throw new Error("Chain not supported. Please add it to your wallet.")
          }
          throw switchError
        }
      }
      
      // Mock implementation
      console.log(`Mock switching to chain ID: ${targetChainId}`)
      setChainId(targetChainId)
      return true
    } catch (error) {
      console.error("Chain switch error:", error)
      
      toast({
        title: "Network Switch Failed",
        description: (error as Error)?.message || "Could not switch network",
        variant: "destructive"
      })
      
      return false
    }
  }

  return (
    <Web3Context.Provider value={{ 
      address, 
      isConnected, 
      connect, 
      disconnect, 
      signMessage,
      chainId,
      switchChain,
      walletType
    }}>
      {children}
    </Web3Context.Provider>
  )
}
