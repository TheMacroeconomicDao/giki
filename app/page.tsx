import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Globe, Lock, Users } from "lucide-react"
import Link from "next/link"
import { RecentPages } from "@/components/recent-pages"
import { PopularPages } from "@/components/popular-pages"

export default function Home() {
  return (
    <div className="container mx-auto space-y-8">
      <div className="text-center space-y-4 py-10">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Giki.js</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The next generation wiki platform with AI-powered translation and Web3 authentication
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button asChild size="lg">
            <Link href="/create">Create Page</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/explore">Explore</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <CardTitle>Public</CardTitle>
            </div>
            <CardDescription>Content visible to everyone on the internet</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Share knowledge with the world. Public pages are indexed by search engines and accessible to all visitors.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/explore/public">Browse Public Pages</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <CardTitle>Community</CardTitle>
            </div>
            <CardDescription>Content visible to registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Collaborate with other members. Community pages are only visible to authenticated users of the platform.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/explore/community">Browse Community Pages</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-500" />
              <CardTitle>Private</CardTitle>
            </div>
            <CardDescription>Content visible only to you</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Keep your personal notes secure. Private pages are only accessible to you and cannot be shared with
              others.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/private">My Private Pages</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="recent">Recent Pages</TabsTrigger>
          <TabsTrigger value="popular">Popular Pages</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="mt-6">
          <RecentPages />
        </TabsContent>
        <TabsContent value="popular" className="mt-6">
          <PopularPages />
        </TabsContent>
      </Tabs>

      <div className="bg-muted/50 rounded-lg p-6 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Getting Started</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Your First Page</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Learn how to create and format wiki pages using our powerful editor.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link href="/docs/create-page">Read Guide</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>AI Translation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Discover how to use our one-click translation feature to create multilingual content.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link href="/docs/translation">Read Guide</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Web3 Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Connect your crypto wallet to securely sign in without passwords.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link href="/docs/web3-auth">Read Guide</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
