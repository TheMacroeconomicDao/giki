"use client"

import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { BarChart, BookOpen, Database, FileText, Github, Globe, Lock, Settings, Shield, Users, Zap } from "lucide-react"
import { useWeb3 } from "@/hooks/use-web3"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const { isConnected, address } = useWeb3()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  // Mock admin check - in a real app, this would verify admin rights
  useEffect(() => {
    // Simulate admin check
    setIsAdmin(true)

    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to access the admin panel.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          System Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Total Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">248</div>
            <p className="text-sm text-muted-foreground mt-1">+12 in the last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">56</div>
            <p className="text-sm text-muted-foreground mt-1">+8 in the last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart className="h-5 w-5 text-purple-500" />
              Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12,456</div>
            <p className="text-sm text-muted-foreground mt-1">+23% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Public Pages
                </CardTitle>
                <CardDescription>Manage publicly accessible pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">124</div>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>Active: 118</span>
                  <span>Drafts: 6</span>
                </div>
                <Button className="w-full">Manage Public Pages</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Community Pages
                </CardTitle>
                <CardDescription>Manage community-only pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">86</div>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>Active: 78</span>
                  <span>Drafts: 8</span>
                </div>
                <Button className="w-full">Manage Community Pages</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-500" />
                  Private Pages
                </CardTitle>
                <CardDescription>View statistics on private pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">38</div>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>Users with private pages: 12</span>
                </div>
                <Button className="w-full">View Statistics</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  User Management
                </CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">56 Users</div>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>Admins: 3</span>
                  <span>Editors: 18</span>
                  <span>Viewers: 35</span>
                </div>
                <Button className="w-full">Manage Users</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Roles & Permissions
                </CardTitle>
                <CardDescription>Configure access control</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">5 Roles</div>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>Custom roles: 2</span>
                </div>
                <Button className="w-full">Edit Permissions</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  Activity Log
                </CardTitle>
                <CardDescription>View user activity and audit logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">1,245 Events</div>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>Last 30 days</span>
                </div>
                <Button className="w-full">View Logs</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  General Settings
                </CardTitle>
                <CardDescription>Configure site-wide settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Edit Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-500" />
                  Editor Settings
                </CardTitle>
                <CardDescription>Configure the Markdown editor</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Edit Editor Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-500" />
                  Language Settings
                </CardTitle>
                <CardDescription>Configure translation options</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Edit Language Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-blue-500" />
                  GitHub Integration
                </CardTitle>
                <CardDescription>Sync content with GitHub repositories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  Status: <span className="text-green-500 font-medium">Connected</span>
                </div>
                <Button className="w-full">Configure</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-500" />
                  OpenAI Integration
                </CardTitle>
                <CardDescription>Configure AI translation settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  Status: <span className="text-green-500 font-medium">Connected</span>
                </div>
                <Button className="w-full">Configure</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-500" />
                  Database Settings
                </CardTitle>
                <CardDescription>Configure database connection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  Status: <span className="text-green-500 font-medium">Connected</span>
                </div>
                <Button className="w-full">Configure</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backups" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  Database Backups
                </CardTitle>
                <CardDescription>Manage database backup schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  Last backup: <span className="font-medium">Today at 03:15 AM</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button>Create Backup</Button>
                  <Button variant="outline">View Backups</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-green-500" />
                  GitHub Sync
                </CardTitle>
                <CardDescription>Sync content with GitHub repositories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  Last sync: <span className="font-medium">Today at 04:30 AM</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button>Sync Now</Button>
                  <Button variant="outline">View Sync History</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
