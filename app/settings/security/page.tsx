"use client"

import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { AlertCircle, Key, RotateCcw, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"

export default function SecuritySettings() {
  const { toast } = useToast()
  const { user, logout } = useAuth()
  const [disconnecting, setDisconnecting] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  const handleDisconnectWallet = async () => {
    try {
      setDisconnecting(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Log out the user
      logout()

      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected successfully",
      })
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
      toast({
        title: "Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      })
    } finally {
      setDisconnecting(false)
    }
  }

  const handleRegenerateToken = async () => {
    try {
      setRegenerating(true)

      // In a real app, this would be an API call
      // const response = await fetch("/api/auth/regenerate-token", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Token regenerated",
        description: "Your access token has been regenerated successfully",
      })
    } catch (error) {
      console.error("Error regenerating token:", error)
      toast({
        title: "Error",
        description: "Failed to regenerate token",
        variant: "destructive",
      })
    } finally {
      setRegenerating(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in</h1>
        <p>You need to be logged in to access your security settings.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Security Settings
          </CardTitle>
          <CardDescription>Manage your account security and connected devices.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Connected Wallet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your account is currently connected to the following wallet address:
              </p>
              <div className="p-4 bg-muted rounded-md font-mono text-sm">{user.address}</div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Disconnecting your wallet will log you out. You will need to reconnect your wallet to access your
                account again.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end">
              <Button variant="destructive" onClick={handleDisconnectWallet} disabled={disconnecting}>
                {disconnecting ? "Disconnecting..." : "Disconnect Wallet"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-500" />
            Access Tokens
          </CardTitle>
          <CardDescription>Manage your API access tokens.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Current Access Token</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your access token is used to authenticate API requests. Keep it secure and do not share it with others.
              </p>
              <div className="p-4 bg-muted rounded-md font-mono text-sm">
                ••••••••••••••••••••••••••••••••••••••••••••••••••
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Regenerating your access token will invalidate your current token. Any applications using the old token
                will need to be updated.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={handleRegenerateToken} disabled={regenerating} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {regenerating ? "Regenerating..." : "Regenerate Token"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
