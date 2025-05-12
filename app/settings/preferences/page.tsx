"use client"

import { useState, useEffect } from "react"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { Label } from "@/shared/ui/label"
import { Switch } from "@/shared/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Bell, Globe, Moon, Save, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function PreferencesSettings() {
  const { toast } = useToast()
  const { user, updateUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState({
    language: "en",
    theme: "system",
    emailNotifications: true,
  })

  useEffect(() => {
    if (user?.preferences) {
      setPreferences({
        language: user.preferences.language || "en",
        theme: user.preferences.theme || "system",
        emailNotifications: user.preferences.emailNotifications !== false,
      })
    }
  }, [user])

  useEffect(() => {
    // Sync theme with next-themes
    if (preferences.theme) {
      setTheme(preferences.theme)
    }
  }, [preferences.theme, setTheme])

  const handleSave = async () => {
    try {
      setLoading(true)

      // In a real app, this would be an API call
      // const response = await fetch(`/api/users/${user.id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ preferences }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user in context
      updateUser({
        preferences,
      })

      toast({
        title: "Preferences updated",
        description: "Your preferences have been updated successfully",
      })
    } catch (error) {
      console.error("Error updating preferences:", error)
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in</h1>
        <p>You need to be logged in to access your preferences settings.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Preferences</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Language & Display
            </CardTitle>
            <CardDescription>Configure your language and display preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="language">Default Language</Label>
                <select
                  id="language"
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ru">Russian</option>
                </select>
                <p className="text-sm text-muted-foreground">
                  This is the default language for content and interface elements.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="theme">Theme</Label>
                <div className="flex gap-4">
                  <div
                    className={`flex flex-col items-center gap-2 rounded-md border p-4 cursor-pointer ${
                      preferences.theme === "light" ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => setPreferences({ ...preferences, theme: "light" })}
                  >
                    <Sun className="h-6 w-6" />
                    <span>Light</span>
                  </div>
                  <div
                    className={`flex flex-col items-center gap-2 rounded-md border p-4 cursor-pointer ${
                      preferences.theme === "dark" ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => setPreferences({ ...preferences, theme: "dark" })}
                  >
                    <Moon className="h-6 w-6" />
                    <span>Dark</span>
                  </div>
                  <div
                    className={`flex flex-col items-center gap-2 rounded-md border p-4 cursor-pointer ${
                      preferences.theme === "system" ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => setPreferences({ ...preferences, theme: "system" })}
                  >
                    <div className="flex">
                      <Sun className="h-6 w-6" />
                      <Moon className="h-6 w-6" />
                    </div>
                    <span>System</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how and when you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="block">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important updates and activity.
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSave} disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
