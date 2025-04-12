"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md text-center">
        <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-red-600" />
        <h1 className="mb-2 text-2xl font-bold">Something went wrong!</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">An unexpected error occurred. Please try again later.</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="bg-emerald-600 hover:bg-emerald-700">
            Try again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 rounded-md bg-red-50 p-4 text-left dark:bg-red-900/20">
            <h3 className="mb-2 font-semibold text-red-800 dark:text-red-300">Error details:</h3>
            <p className="text-sm text-red-700 dark:text-red-400">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
