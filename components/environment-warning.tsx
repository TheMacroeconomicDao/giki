"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"

export function EnvironmentWarning() {
  const [dismissed, setDismissed] = useState(false)
  const { isMetaMaskInstalled } = useAuth()

  if (dismissed || isMetaMaskInstalled) {
    return null
  }

  return (
    <Alert className="mb-4 border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
      <div className="flex-1">
        <AlertTitle className="text-amber-800 dark:text-amber-500">MetaMask Required</AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-400">
          This Wiki.js interface requires MetaMask for wallet authentication. Please{" "}
          <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="underline">
            install MetaMask
          </a>{" "}
          to connect your wallet.
        </AlertDescription>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-amber-600 hover:bg-amber-100 hover:text-amber-700 dark:text-amber-500 dark:hover:bg-amber-900"
        onClick={() => setDismissed(true)}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  )
}
