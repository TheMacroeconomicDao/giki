"use client"

import { useState, useEffect } from "react"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Switch } from "@/shared/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Check, Globe, Github, Key, RotateCcw, Save, Settings, Zap } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"

interface SettingsState {
  SITE_NAME: string
  SITE_DESCRIPTION: string
  OPENAI_API_KEY: string
  GITHUB_TOKEN: string
  GITHUB_OWNER: string
  GITHUB_REPO: string
  DEFAULT_LANGUAGE: string
  ALLOWED_LANGUAGES: string
  ENABLE_PUBLIC_REGISTRATION: boolean
  ENABLE_GITHUB_SYNC: boolean
  ENABLE_AI_TRANSLATION: boolean
}

export default function AdminSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<SettingsState>({
    SITE_NAME: "",
    SITE_DESCRIPTION: "",
    OPENAI_API_KEY: "",
    GITHUB_TOKEN: "",
    GITHUB_OWNER: "",
    GITHUB_REPO: "",
    DEFAULT_LANGUAGE: "en",
    ALLOWED_LANGUAGES: "",
    ENABLE_PUBLIC_REGISTRATION: true,
    ENABLE_GITHUB_SYNC: true,
    ENABLE_AI_TRANSLATION: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testingOpenAI, setTestingOpenAI] = useState(false)
  const [testingGitHub, setTestingGitHub] = useState(false)
  const [openAIStatus, setOpenAIStatus] = useState<"idle" | "success" | "error">("idle")
  const [githubStatus, setGithubStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        // In a real app, this would be an API call
        // const response = await fetch("/api/settings")
        // const data = await response.json()

        // Mock data for demonstration
        const data = {
          settings: {
            SITE_NAME: "Giki.js",
            SITE_DESCRIPTION: "Next-Generation Wiki Platform",
            DEFAULT_LANGUAGE: "en",
            ALLOWED_LANGUAGES: "en,es,fr,de,ru",
            ENABLE_PUBLIC_REGISTRATION: "true",
            ENABLE_GITHUB_SYNC: "true",
            ENABLE_AI_TRANSLATION: "true",
          },
        }

        setSettings({
          ...settings,
          ...data.settings,
          ENABLE_PUBLIC_REGISTRATION: data.settings.ENABLE_PUBLIC_REGISTRATION === "true",
          ENABLE_GITHUB_SYNC: data.settings.ENABLE_GITHUB_SYNC === "true",
          ENABLE_AI_TRANSLATION: data.settings.ENABLE_AI_TRANSLATION === "true",
        })
      } catch (error) {
        console.error("Error fetching settings:", error)
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [toast])

  const handleSaveSettings = async () => {
    try {
      setSaving(true)

      // Convert boolean values to strings for API
      const apiSettings = {
        ...settings,
        ENABLE_PUBLIC_REGISTRATION: settings.ENABLE_PUBLIC_REGISTRATION.toString(),
        ENABLE_GITHUB_SYNC: settings.ENABLE_GITHUB_SYNC.toString(),
        ENABLE_AI_TRANSLATION: settings.ENABLE_AI_TRANSLATION.toString(),
      }

      // In a real app, this would be an API call
      // const response = await fetch("/api/settings", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ settings: apiSettings }),
      // })

      // if (!response.ok) {
      //   throw new Error("Failed to save settings")
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const testOpenAIConnection = async () => {
    try {
      setTestingOpenAI(true)
      setOpenAIStatus("idle")

      if (!settings.OPENAI_API_KEY) {
        toast({
          title: "Error",
          description: "Please enter an OpenAI API key",
          variant: "destructive",
        })
        return
      }

      // In a real app, this would be an API call to test the connection
      // const response = await fetch("/api/test/openai", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ apiKey: settings.OPENAI_API_KEY }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success
      setOpenAIStatus("success")
      toast({
        title: "Connection successful",
        description: "OpenAI API connection is working correctly",
      })
    } catch (error) {
      console.error("Error testing OpenAI connection:", error)
      setOpenAIStatus("error")
      toast({
        title: "Connection failed",
        description: "Could not connect to OpenAI API. Please check your API key.",
        variant: "destructive",
      })
    } finally {
      setTestingOpenAI(false)
    }
  }

  const testGitHubConnection = async () => {
    try {
      setTestingGitHub(true)
      setGithubStatus("idle")

      if (!settings.GITHUB_TOKEN || !settings.GITHUB_OWNER || !settings.GITHUB_REPO) {
        toast({
          title: "Error",
          description: "Please enter all GitHub settings",
          variant: "destructive",
        })
        return
      }

      // In a real app, this would be an API call to test the connection
      // const response = await fetch("/api/test/github", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     token: settings.GITHUB_TOKEN,
      //     owner: settings.GITHUB_OWNER,
      //     repo: settings.GITHUB_REPO,
      //   }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success
      setGithubStatus("success")
      toast({
        title: "Connection successful",
        description: "GitHub connection is working correctly",
      })
    } catch (error) {
      console.error("Error testing GitHub connection:", error)
      setGithubStatus("error")
      toast({
        title: "Connection failed",
        description: "Could not connect to GitHub. Please check your settings.",
        variant: "destructive",
      })
    } finally {
      setTestingGitHub(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <Button onClick={handleSaveSettings} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                General Settings
              </CardTitle>
              <CardDescription>Configure basic site settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  value={settings.SITE_NAME}
                  onChange={(e) => setSettings({ ...settings, SITE_NAME: e.target.value })}
                  placeholder="Giki.js"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Input
                  id="site-description"
                  value={settings.SITE_DESCRIPTION}
                  onChange={(e) => setSettings({ ...settings, SITE_DESCRIPTION: e.target.value })}
                  placeholder="Next-Generation Wiki Platform"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="public-registration">Allow Public Registration</Label>
                  <Switch
                    id="public-registration"
                    checked={settings.ENABLE_PUBLIC_REGISTRATION}
                    onCheckedChange={(checked) => setSettings({ ...settings, ENABLE_PUBLIC_REGISTRATION: checked })}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, anyone can register and create an account. When disabled, only admins can create new
                  accounts.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-500" />
                OpenAI Integration
              </CardTitle>
              <CardDescription>Configure AI translation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-ai">Enable AI Translation</Label>
                  <Switch
                    id="enable-ai"
                    checked={settings.ENABLE_AI_TRANSLATION}
                    onCheckedChange={(checked) => setSettings({ ...settings, ENABLE_AI_TRANSLATION: checked })}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, users can translate content using OpenAI's language models.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="openai-key"
                    type="password"
                    value={settings.OPENAI_API_KEY}
                    onChange={(e) => setSettings({ ...settings, OPENAI_API_KEY: e.target.value })}
                    placeholder="sk-..."
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={testOpenAIConnection} disabled={testingOpenAI} className="gap-2">
                    {testingOpenAI ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Testing...
                      </>
                    ) : openAIStatus === "success" ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        Connected
                      </>
                    ) : openAIStatus === "error" ? (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        Failed
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-4 w-4" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your OpenAI API key is stored securely and used for AI translation features.
                </p>
              </div>

              {openAIStatus === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Connection Error</AlertTitle>
                  <AlertDescription>
                    Could not connect to OpenAI API. Please check your API key and try again.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5 text-purple-500" />
                GitHub Integration
              </CardTitle>
              <CardDescription>Configure GitHub backup settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-github">Enable GitHub Sync</Label>
                  <Switch
                    id="enable-github"
                    checked={settings.ENABLE_GITHUB_SYNC}
                    onCheckedChange={(checked) => setSettings({ ...settings, ENABLE_GITHUB_SYNC: checked })}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, content will be automatically backed up to a GitHub repository.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="github-token">GitHub Personal Access Token</Label>
                <Input
                  id="github-token"
                  type="password"
                  value={settings.GITHUB_TOKEN}
                  onChange={(e) => setSettings({ ...settings, GITHUB_TOKEN: e.target.value })}
                  placeholder="ghp_..."
                />
                <p className="text-sm text-muted-foreground">
                  Create a token with 'repo' scope at GitHub Developer Settings.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="github-owner">Repository Owner</Label>
                  <Input
                    id="github-owner"
                    value={settings.GITHUB_OWNER}
                    onChange={(e) => setSettings({ ...settings, GITHUB_OWNER: e.target.value })}
                    placeholder="username or organization"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="github-repo">Repository Name</Label>
                  <Input
                    id="github-repo"
                    value={settings.GITHUB_REPO}
                    onChange={(e) => setSettings({ ...settings, GITHUB_REPO: e.target.value })}
                    placeholder="giki-backup"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={testGitHubConnection} disabled={testingGitHub} className="gap-2">
                  {testingGitHub ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Testing...
                    </>
                  ) : githubStatus === "success" ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      Connected
                    </>
                  ) : githubStatus === "error" ? (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      Failed
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      Test Connection
                    </>
                  )}
                </Button>
              </div>

              {githubStatus === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Connection Error</AlertTitle>
                  <AlertDescription>
                    Could not connect to GitHub. Please check your token, owner, and repository name.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="languages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                Language Settings
              </CardTitle>
              <CardDescription>Configure language options for the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="default-language">Default Language</Label>
                <select
                  id="default-language"
                  value={settings.DEFAULT_LANGUAGE}
                  onChange={(e) => setSettings({ ...settings, DEFAULT_LANGUAGE: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ru">Russian</option>
                </select>
                <p className="text-sm text-muted-foreground">
                  The default language for new content and the user interface.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="allowed-languages">Allowed Languages</Label>
                <Input
                  id="allowed-languages"
                  value={settings.ALLOWED_LANGUAGES}
                  onChange={(e) => setSettings({ ...settings, ALLOWED_LANGUAGES: e.target.value })}
                  placeholder="en,es,fr,de,ru"
                />
                <p className="text-sm text-muted-foreground">
                  Comma-separated list of language codes that can be used for translation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-red-500" />
                Advanced Settings
              </CardTitle>
              <CardDescription>Configure advanced system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  These settings are for advanced users only. Incorrect configuration may cause system instability.
                </AlertDescription>
              </Alert>

              <div className="mt-4 space-y-4">
                {/* Add advanced settings here */}
                <p className="text-sm text-muted-foreground">Advanced settings will be available in a future update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
