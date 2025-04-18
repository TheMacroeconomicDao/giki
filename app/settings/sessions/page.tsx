"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Computer, LogOut, Shield } from "lucide-react"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SessionsPage() {
  const { toast } = useToast()
  const { user, sessions, fetchSessions, terminateSession, logout } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSessions = async () => {
      if (!user) return

      setLoading(true)
      await fetchSessions()
      setLoading(false)
    }

    loadSessions()
  }, [user, fetchSessions])

  const handleTerminateSession = async (sessionId: string) => {
    await terminateSession(sessionId)
  }

  const handleTerminateAllSessions = async () => {
    try {
      // This will log the user out and terminate all sessions
      await logout()

      toast({
        title: "All sessions terminated",
        description: "You have been logged out from all devices",
      })
    } catch (error) {
      console.error("Error terminating all sessions:", error)
      toast({
        title: "Error",
        description: "Failed to terminate all sessions",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in</h1>
        <p>You need to be logged in to access your session settings.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Active Sessions
          </CardTitle>
          <CardDescription>These are your currently active sessions across all devices.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">No active sessions found.</p>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Computer className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{session.userAgent.split("/")[0]}</div>
                      <div className="text-sm text-muted-foreground">
                        Last active: {format(new Date(session.lastActive), "PPp")}
                      </div>
                      <div className="text-xs text-muted-foreground">IP: {session.ip}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTerminateSession(session.id)}
                    className="gap-1"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-6 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Logout from all devices
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will terminate all your active sessions and log you out from all devices. You will need to log
                    in again on each device.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleTerminateAllSessions}>
                    Yes, logout from all devices
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
