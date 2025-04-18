"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Add global error handler
    const errorHandler = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error)
      setError(event.error)
      setHasError(true)

      // Prevent default browser error handling
      event.preventDefault()
    }

    // Add unhandled rejection handler
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason)
      setError(new Error(String(event.reason)))
      setHasError(true)

      // Prevent default browser error handling
      event.preventDefault()
    }

    window.addEventListener("error", errorHandler)
    window.addEventListener("unhandledrejection", rejectionHandler)

    return () => {
      window.removeEventListener("error", errorHandler)
      window.removeEventListener("unhandledrejection", rejectionHandler)
    }
  }, [])

  const handleReset = () => {
    setHasError(false)
    setError(null)
  }

  if (hasError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md p-6 bg-background border rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <div className="text-left mb-4 p-4 bg-muted rounded-md overflow-auto max-h-[200px]">
            <p className="font-mono text-sm text-destructive">{error?.message || "Unknown error"}</p>
            {error?.stack && (
              <pre className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap">{error.stack}</pre>
            )}
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleReset}>Try Again</Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
