"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { Loader2, LogIn, Wallet } from "lucide-react"

export function SignInButton() {
  const { isConnected, isAuthenticated, wallet, connectWallet, signIn, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleAuth = async () => {
    setIsLoading(true)
    try {
      if (!isConnected) {
        // First connect wallet
        const connected = await connectWallet()
        if (connected) {
          // Then automatically sign in without requiring another click
          await signIn()
        }
      } else if (!isAuthenticated) {
        // Already connected, just sign in
        await signIn()
      } else {
        // Already authenticated, sign out
        signOut()
      }
    } catch (error) {
      console.error("Authentication error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthenticated && wallet.address) {
    return (
      <Button
        variant="outline"
        className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-900"
        onClick={signOut}
      >
        {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
      </Button>
    )
  }

  return (
    <Button
      variant={isConnected ? "default" : "outline"}
      className={isConnected ? "bg-emerald-600 hover:bg-emerald-700" : ""}
      onClick={handleAuth}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isConnected ? "Signing In..." : "Connecting..."}
        </>
      ) : (
        <>
          {isConnected ? <LogIn className="mr-2 h-4 w-4" /> : <Wallet className="mr-2 h-4 w-4" />}
          Sign In
        </>
      )}
    </Button>
  )
}
