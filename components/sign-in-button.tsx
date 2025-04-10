"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { Loader2, LogIn, LogOut } from "lucide-react"

export function SignInButton() {
  const { isConnected, isAuthenticated, signIn, signOut } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleSignIn = async () => {
    setIsSigningIn(true)
    try {
      await signIn()
    } finally {
      setIsSigningIn(false)
    }
  }

  if (!isConnected) {
    return null
  }

  if (isAuthenticated) {
    return (
      <Button variant="outline" className="flex items-center gap-2" onClick={signOut}>
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    )
  }

  return (
    <Button
      variant="default"
      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
      onClick={handleSignIn}
      disabled={isSigningIn}
    >
      {isSigningIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
      Sign In
    </Button>
  )
}
