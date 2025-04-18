import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Globe, Star, Users } from "lucide-react"
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
  views: number
  stars: number
  visibility: "public" | "community"
  path: string
}

const popularPages: PageItem[] = [
  {
    id: "1",
    title: "Complete User Guide",
    description: "Everything you need to know about using Giki.js effectively",
    author: {
      name: "Admin",
      avatar: "",
      address: "0x1234",
    },
    views: 1245,
    stars: 32,
    visibility: "public",
    path: "/explore/public/user-guide",
  },
  {
    id: "2",
    title: "Markdown Cheat Sheet",
    description: "Quick reference for Markdown syntax supported in the editor",
    author: {
      name: "Sarah",
      avatar: "",
      address: "0x5678",
    },
    views: 987,
    stars: 28,
    visibility: "public",
    path: "/explore/public/markdown-guide",
  },
  {
    id: "3",
    title: "API Documentation",
    description: "Complete reference for the Giki.js API endpoints and usage",
    author: {
      name: "Alex",
      avatar: "",
      address: "0x9abc",
    },
    views: 756,
    stars: 19,
    visibility: "public",
    path: "/explore/public/api-docs",
  },
  {
    id: "4",
    title: "Contributing Guidelines",
    description: "How to contribute to the Giki.js project and community",
    author: {
      name: "Mike",
      avatar: "",
      address: "0xdef0",
    },
    views: 543,
    stars: 15,
    visibility: "community",
    path: "/explore/community/contributing",
  },
]

export function PopularPages() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {popularPages.map((page) => (
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
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>{page.views}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="h-3 w-3" />
                  <span>{page.stars}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
