import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Globe, Users } from "lucide-react"
import Link from "next/link"

interface PageItem {
  id: string
  title: string
  description: string
  author: {
    name: string
    avatar: string
    address: string
  }
  updatedAt: string
  visibility: "public" | "community"
  path: string
}

const recentPages: PageItem[] = [
  {
    id: "1",
    title: "Getting Started with Giki.js",
    description: "Learn how to create your first wiki page and navigate the platform",
    author: {
      name: "Admin",
      avatar: "",
      address: "0x1234",
    },
    updatedAt: "2 hours ago",
    visibility: "public",
    path: "/explore/public/getting-started",
  },
  {
    id: "2",
    title: "AI Translation Guide",
    description: "How to use the one-click translation feature to create multilingual content",
    author: {
      name: "Sarah",
      avatar: "",
      address: "0x5678",
    },
    updatedAt: "5 hours ago",
    visibility: "public",
    path: "/explore/public/ai-translation",
  },
  {
    id: "3",
    title: "Development Roadmap",
    description: "Upcoming features and improvements planned for Giki.js",
    author: {
      name: "Alex",
      avatar: "",
      address: "0x9abc",
    },
    updatedAt: "1 day ago",
    visibility: "community",
    path: "/explore/community/roadmap",
  },
  {
    id: "4",
    title: "Web3 Authentication Setup",
    description: "How to connect your crypto wallet and sign in securely",
    author: {
      name: "Mike",
      avatar: "",
      address: "0xdef0",
    },
    updatedAt: "2 days ago",
    visibility: "public",
    path: "/explore/public/web3-auth",
  },
]

export function RecentPages() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {recentPages.map((page) => (
        <Card key={page.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  <Link href={page.path} className="hover:underline">
                    {page.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-1">{page.description}</CardDescription>
              </div>
              {page.visibility === "public" ? (
                <Globe className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Users className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={page.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{page.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">{page.author.name}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{page.updatedAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
