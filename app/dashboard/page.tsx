"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { BarChart3, BookOpen, Clock, Edit, FileText, Github, Globe, Lock, Settings, Users } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { PageGrid } from "@/components/page-grid"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState({
    public: { count: 0, draft: 0 },
    community: { count: 0, draft: 0 },
    private: { count: 0, draft: 0 },
    recent: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        // Get page counts
        const publicRes = await fetch(`/api/pages?visibility=public&author_id=${user?.id}`)
        const publicPages = await publicRes.json()

        const communityRes = await fetch(`/api/pages?visibility=community&author_id=${user?.id}`)
        const communityPages = await communityRes.json()

        const privateRes = await fetch(`/api/pages?visibility=private&author_id=${user?.id}`)
        const privatePages = await privateRes.json()

        // Get recent pages
        const recentRes = await fetch(`/api/pages?limit=5&offset=0&author_id=${user?.id}`)
        const recentPages = await recentRes.json()

        setStats({
          public: { count: publicPages.data.total, draft: 0 },
          community: { count: communityPages.data.total, draft: 0 },
          private: { count: privatePages.data.total, draft: 0 },
          recent: recentPages.data.pages,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && user) {
      fetchStats()
    }
  }, [isAuthenticated, user, toast])

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-10 space-y-4 text-center">
        <h1 className="text-2xl font-bold">Please log in</h1>
        <p>You need to be logged in to access your dashboard.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/create">
              <FileText className="mr-2 h-4 w-4" />
              Create Page
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Public Pages
            </CardTitle>
            <CardDescription>Your publicly visible pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "..." : stats.public.count}</div>
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Published: {loading ? "..." : stats.public.count - stats.public.draft}</span>
              <span>Drafts: {loading ? "..." : stats.public.draft}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" asChild className="w-full">
              <Link href="/pages?visibility=public&author=me">View All Public Pages</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Community Pages
            </CardTitle>
            <CardDescription>Visible to all registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "..." : stats.community.count}</div>
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Published: {loading ? "..." : stats.community.count - stats.community.draft}</span>
              <span>Drafts: {loading ? "..." : stats.community.draft}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" asChild className="w-full">
              <Link href="/pages?visibility=community&author=me">View All Community Pages</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-500" />
              Private Pages
            </CardTitle>
            <CardDescription>Only visible to you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "..." : stats.private.count}</div>
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Published: {loading ? "..." : stats.private.count - stats.private.draft}</span>
              <span>Drafts: {loading ? "..." : stats.private.draft}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" asChild className="w-full">
              <Link href="/pages?visibility=private&author=me">View All Private Pages</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Pages</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="stats">Your Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="mt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : stats.recent.length > 0 ? (
            <PageGrid pages={stats.recent} />
          ) : (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No pages yet</h3>
              <p className="mt-2 text-muted-foreground">
                You haven&apos;t created any pages yet. Get started by creating your first page.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/create">Create Your First Page</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="activity" className="mt-6">
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {stats.recent.slice(0, 5).map((page, i) => (
                      <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <div className="rounded-full bg-primary/10 p-2">
                          {i % 3 === 0 ? (
                            <Edit className="h-4 w-4" />
                          ) : i % 3 === 1 ? (
                            <Globe className="h-4 w-4" />
                          ) : (
                            <Github className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            You {i % 3 === 0 ? "edited" : i % 3 === 1 ? "published" : "synced"}{" "}
                            <Link href={`/pages/${page.id}`} className="text-primary hover:underline">
                              {page.title}
                            </Link>
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {new Date(page.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8">
                <div>
                  <h4 className="text-sm font-medium mb-3">Pages Created</h4>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${Math.min(100, (stats.public.count + stats.community.count + stats.private.count) * 5)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {stats.public.count + stats.community.count + stats.private.count}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Content Distribution</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-500">
                        {loading
                          ? "..."
                          : Math.round(
                              (stats.public.count /
                                (stats.public.count + stats.community.count + stats.private.count || 1)) *
                                100,
                            )}
                        %
                      </div>
                      <p className="text-sm text-muted-foreground">Public</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">
                        {loading
                          ? "..."
                          : Math.round(
                              (stats.community.count /
                                (stats.public.count + stats.community.count + stats.private.count || 1)) *
                                100,
                            )}
                        %
                      </div>
                      <p className="text-sm text-muted-foreground">Community</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-500">
                        {loading
                          ? "..."
                          : Math.round(
                              (stats.private.count /
                                (stats.public.count + stats.community.count + stats.private.count || 1)) *
                                100,
                            )}
                        %
                      </div>
                      <p className="text-sm text-muted-foreground">Private</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
