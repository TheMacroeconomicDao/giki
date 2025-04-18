"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Globe, Lock, Users, Eye, Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Author {
  id: string
  name: string | null
  address: string
}

interface Page {
  id: string
  title: string
  content: string
  visibility: "public" | "community" | "private"
  author: Author
  createdAt: string
  updatedAt: string
  views?: number
}

interface PageGridProps {
  pages: Page[]
  showAuthor?: boolean
}

export function PageGrid({ pages, showAuthor = true }: PageGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pages.map((page) => (
        <Card key={page.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  <Link href={`/pages/${page.id}`} className="hover:underline">
                    {page.title}
                  </Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  {getVisibilityIcon(page.visibility)}
                  <span>{getVisibilityText(page.visibility)}</span>
                </CardDescription>
              </div>
              {page.views !== undefined && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>{page.views}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="line-clamp-2 text-sm text-muted-foreground mb-3">
              {stripMarkdown(page.content).slice(0, 120)}
              {stripMarkdown(page.content).length > 120 ? "..." : ""}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {showAuthor && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-[10px]">
                      {page.author.name
                        ? page.author.name.slice(0, 2).toUpperCase()
                        : page.author.address.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{page.author.name || shortenAddress(page.author.address)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Helper functions
function getVisibilityIcon(visibility: string) {
  switch (visibility) {
    case "public":
      return <Globe className="h-3.5 w-3.5" />
    case "community":
      return <Users className="h-3.5 w-3.5" />
    case "private":
      return <Lock className="h-3.5 w-3.5" />
    default:
      return <Globe className="h-3.5 w-3.5" />
  }
}

function getVisibilityText(visibility: string) {
  switch (visibility) {
    case "public":
      return "Public"
    case "community":
      return "Community"
    case "private":
      return "Private"
    default:
      return "Public"
  }
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function stripMarkdown(text: string) {
  return text
    .replace(/#+\s?(.*)/g, "$1") // Remove headers
    .replace(/\*\*(.*)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*)\*/g, "$1") // Remove italic
    .replace(/\[(.*)\]$$(.*)$$/g, "$1") // Remove links
    .replace(/!\[(.*)\]$$(.*)$$/g, "[Image]") // Replace images
    .replace(/```([\s\S]*?)```/g, "[Code Block]") // Replace code blocks
    .replace(/`(.*)`/g, "$1") // Remove inline code
    .replace(/^\s*>\s*(.*)/gm, "$1") // Remove blockquotes
    .replace(/^\s*[-*+]\s*(.*)/gm, "• $1") // Replace lists
    .replace(/^\s*\d+\.\s*(.*)/gm, "• $1") // Replace ordered lists
}
