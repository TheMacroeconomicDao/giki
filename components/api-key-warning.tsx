"use client"

import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState, useEffect } from "react"

export function ApiKeyWarning() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    // Check if translation is working by making a test request
    const checkTranslation = async () => {
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: "Hello",
            fromLanguage: "en",
            toLanguage: "ru",
          }),
        })

        // If the response is not successful or contains an error, show the warning
        if (!response.ok) {
          setIsVisible(true)
          return
        }

        const data = await response.json()
        if (!data.success) {
          setIsVisible(true)
        }
      } catch (error) {
        console.error("Error checking translation:", error)
        setIsVisible(true)
      } finally {
        setHasChecked(true)
      }
    }

    checkTranslation()
  }, [])

  if (!isVisible || !hasChecked) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Translation Service Issue</AlertTitle>
      <AlertDescription>
        The OpenAI API key appears to be missing or invalid. Translation features will be limited. Please add a valid
        API key to your environment variables to enable full translation functionality.
      </AlertDescription>
    </Alert>
  )
}
