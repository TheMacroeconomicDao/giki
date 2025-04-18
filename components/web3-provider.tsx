"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import { ethers } from "ethers"

interface Web3ContextType {
  address: string | null
  isConnected: boolean
  connect: () => Promise<string | undefined>
  disconnect: () => void
  signMessage: (message: string) => Promise<string>
}

export const Web3Context = createContext<Web3ContextType>({
  address: null,
  isConnected: false,
  connect: async () => undefined,
  disconnect: () => {},
  signMessage: async () => "",
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)

  useEffect(() => {
    // Check if user was previously connected
    const wasConnected = localStorage.getItem("walletConnected") === "true"
    const savedAddress = localStorage.getItem("walletAddress")

    if (wasConnected && savedAddress) {
      setAddress(savedAddress)
      setIsConnected(true)

      // Initialize provider if window.ethereum is available
      if (typeof window !== "undefined" && window.ethereum) {
        setProvider(new ethers.BrowserProvider(window.ethereum))
      }
    }
  }, [])

  const connect = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window !== "undefined" && window.ethereum) {
        // Create a new provider
        const ethersProvider = new ethers.BrowserProvider(window.ethereum)
        setProvider(ethersProvider)

        // Request account access
        const accounts = await ethersProvider.send("eth_requestAccounts", [])
        const connectedAddress = accounts[0]

        setAddress(connectedAddress)
        setIsConnected(true)
        localStorage.setItem("walletConnected", "true")
        localStorage.setItem("walletAddress", connectedAddress)

        return connectedAddress
      }

      // If MetaMask is not installed, use mock implementation
      const mockAddress = "0x" + Math.random().toString(16).slice(2, 42)
      setAddress(mockAddress)
      setIsConnected(true)
      localStorage.setItem("walletConnected", "true")
      localStorage.setItem("walletAddress", mockAddress)

      return mockAddress
    } catch (error) {
      console.error("Connection error:", error)
      throw error
    }
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
    setProvider(null)
    localStorage.removeItem("walletConnected")
    localStorage.removeItem("walletAddress")
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
      throw error
    }
  }

  return (
    <Web3Context.Provider value={{ address, isConnected, connect, disconnect, signMessage }}>
      {children}
    </Web3Context.Provider>
  )
}
