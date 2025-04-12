"use client"

import { useState } from "react"
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
    <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
      <div className="flex items-start">
        <AlertCircle className="mr-3 h-5 w-5 text-amber-600 dark:text-amber-500" />
        <div className="flex-1">
          <h3 className="font-medium text-amber-800 dark:text-amber-500">MetaMask Required</h3>
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
            This Giki.js interface requires MetaMask for wallet authentication. Please install MetaMask to connect your
            wallet.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="ml-3 h-6 w-6 p-0 text-amber-600 hover:bg-amber-100 hover:text-amber-700 dark:text-amber-500 dark:hover:bg-amber-900"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  )
}
