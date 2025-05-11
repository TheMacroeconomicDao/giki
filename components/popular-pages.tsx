"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Globe, Users, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

interface Author {
  id: string
  name: string | null
  address: string
}

interface PageItem {
  id: string
  title: string
  content: string
  visibility: "public" | "community" | "private"
  author: Author
  createdAt: string
  updatedAt: string
  views: number
}

export function PopularPages() {
  const [pages, setPages] = useState<PageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPopularPages() {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch pages with higher limit to find ones with more views
        const response = await fetch('/api/pages?limit=20')
        
        if (!response.ok) {
          throw new Error('Failed to fetch popular pages')
        }
        
        const data = await response.json()
        
        if (data.success && data.data.pages) {
          // Sort by views in descending order
          const sortedPages = [...data.data.pages].sort((a, b) => b.views - a.views)
          // Take only top 4
          setPages(sortedPages.slice(0, 4))
        } else {
          throw new Error(data.error || 'Failed to load pages')
        }
      } catch (err) {
        console.error('Error fetching popular pages:', err)
        setError((err as Error).message || 'Failed to load popular pages')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPopularPages()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-2/3 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-6 text-center">
        <AlertCircle className="h-6 w-6 text-destructive mx-auto mb-2" />
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  // No pages state
  if (pages.length === 0) {
    return (
      <div className="text-center p-6 border rounded-md">
        <p className="text-muted-foreground">No pages found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {pages.map((page) => {
        // Extract a short description from content
        const description = page.content
          .replace(/[#*`]/g, '') // Remove markdown characters
          .slice(0, 120) + (page.content.length > 120 ? '...' : '')
          
        return (
          <Card key={page.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    <Link href={`/pages/${page.id}`} className="hover:underline">
                      {page.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">{description}</CardDescription>
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
                    <AvatarImage src={`https://avatar.vercel.sh/${page.author.address}`} />
                    <AvatarFallback className="text-xs">
                      {(page.author.name || page.author.address.slice(0, 6)).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">{page.author.name || page.author.address.slice(0, 6)}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>{page.views}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
