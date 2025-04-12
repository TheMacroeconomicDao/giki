"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type WalletInfo, connectMetaMask, signMessage, isMetaMaskAvailable } from "@/lib/wallet-utils"
import { toast } from "@/components/ui/use-toast"

// Define role types
export type Role = "viewer" | "editor" | "admin"

export interface UserPermissions {
  role: Role
  canView: boolean
  canEdit: boolean
  canDelete: boolean
  canManageUsers: boolean
}

// Map roles to permissions
const rolePermissions: Record<Role, Omit<UserPermissions, "role">> = {
  viewer: {
    canView: true,
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
  },
  editor: {
    canView: true,
    canEdit: true,
    canDelete: false,
    canManageUsers: false,
  },
  admin: {
    canView: true,
    canEdit: true,
    canDelete: true,
    canManageUsers: true,
  },
}

// In a real app, this would come from a database
const addressRoles: Record<string, Role> = {
  // Default role for any address
  default: "editor", // Changed to editor for demo purposes
}

// Auth levels
type AuthLevel = "none" | "connected" | "authenticated"

// Auth context type
type AuthContextType = {
  wallet: WalletInfo
  isConnected: boolean
  isAuthenticated: boolean
  loading: boolean
  authLevel: AuthLevel
  permissions: UserPermissions | null
  connectWallet: () => Promise<boolean>
  disconnectWallet: () => void
  signIn: () => Promise<boolean>
  signOut: () => void
  hasPermission: (permission: keyof Omit<UserPermissions, "role">) => boolean
  isMetaMaskInstalled: boolean
}

// Create context
const AuthContext = createContext<AuthContextType>({
  wallet: { address: null, isConnected: false, chainId: null, connector: null },
  isConnected: false,
  isAuthenticated: false,
  loading: true,
  authLevel: "none",
  permissions: null,
  connectWallet: async () => false,
  disconnectWallet: () => {},
  signIn: async () => false,
  signOut: () => {},
  hasPermission: () => false,
  isMetaMaskInstalled: false,
})

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletInfo>({
    address: null,
    isConnected: false,
    chainId: null,
    connector: null,
  })
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLevel, setAuthLevel] = useState<AuthLevel>("none")
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)

  // Initialize wallet connection
  useEffect(() => {
    const init = async () => {
      setIsMetaMaskInstalled(isMetaMaskAvailable())
      setLoading(false)
    }

    init()
  }, [])

  // Update permissions when address changes
  const updatePermissions = (address: string | null) => {
    if (!address) {
      setPermissions(null)
      return
    }

    const role = addressRoles[address.toLowerCase()] || addressRoles.default
    setPermissions({
      role,
      ...rolePermissions[role],
    })
  }

  // Connect wallet
  const connectWallet = async (): Promise<boolean> => {
    if (!isMetaMaskAvailable()) {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      })
      return false
    }

    try {
      const connectedWallet = await connectMetaMask()
      setWallet(connectedWallet)
      setAuthLevel("connected")
      updatePermissions(connectedWallet.address)

      // Start signing process automatically if we're now connected
      if (connectedWallet.address) {
        return true
      }
      return false
    } catch (error: any) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Connection failed",
        description: error?.message || "Failed to connect wallet",
        variant: "destructive",
      })
      return false
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setWallet({ address: null, isConnected: false, chainId: null, connector: null })
    setAuthLevel("none")
    setIsAuthenticated(false)
    setPermissions(null)

    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  // Sign in with message
  const signIn = async (): Promise<boolean> => {
    if (!wallet.address) return false

    try {
      const message = `Sign this message to authenticate with Wiki.js\n\nNonce: ${generateNonce()}`

      await signMessage(message, wallet.address)

      setIsAuthenticated(true)
      setAuthLevel("authenticated")

      toast({
        title: "Authentication successful",
        description: "You are now signed in with your wallet",
      })

      return true
    } catch (error: any) {
      console.error("Failed to sign message:", error)
      toast({
        title: "Authentication failed",
        description: error?.message || "Failed to sign message",
        variant: "destructive",
      })
      return false
    }
  }

  // Sign out
  const signOut = () => {
    setIsAuthenticated(false)
    setAuthLevel("connected")

    toast({
      title: "Signed out",
      description: "You have been signed out",
    })
  }

  // Generate a random nonce
  const generateNonce = () => {
    return Math.floor(Math.random() * 1000000).toString()
  }

  // Check if user has a specific permission
  const hasPermission = (permission: keyof Omit<UserPermissions, "role">): boolean => {
    if (!permissions) return false
    return permissions[permission]
  }

  return (
    <AuthContext.Provider
      value={{
        wallet,
        isConnected: wallet.isConnected,
        isAuthenticated,
        loading,
        authLevel,
        permissions,
        connectWallet,
        disconnectWallet,
        signIn,
        signOut,
        hasPermission,
        isMetaMaskInstalled,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export const useAuth = () => useContext(AuthContext)
