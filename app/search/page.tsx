"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Clock, Globe, Lock, SearchIcon, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface SearchResult {
  id: string
  title: string
  content: string
  visibility: "public" | "community" | "private"
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    address: string
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const initialQuery = searchParams.get("q") || ""
  const initialVisibility = searchParams.get("visibility") || "all"
  const initialLanguage = searchParams.get("language") || "en"

  const [query, setQuery] = useState(initialQuery)
  const [visibility, setVisibility] = useState(initialVisibility)
  const [language, setLanguage] = useState(initialLanguage)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (initialQuery) {
      handleSearch()
    }
  }, [])

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      setSearched(true)

      // In a real app, this would be an API call
      // const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&visibility=${visibility}&language=${language}`)
      // const data = await response.json()

      // Mock data for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: "Getting Started with Giki.js",
          content: "Welcome to Giki.js! This is a next-generation wiki platform with powerful features.",
          visibility: "public",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          author: {
            id: "1",
            name: "Admin",
            address: "0x1234",
          },
        },
        {
          id: "3",
          title: "AI Translation Guide",
          content: "Giki.js provides AI-powered translation to create multilingual content easily.",
          visibility: "public",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          author: {
            id: "3",
            name: "Alex",
            address: "0x9abc",
          },
        },
        {
          id: "4",
          title: "Web3 Authentication Setup",
          content: "Learn how to use crypto wallets for secure authentication in Giki.js.",
          visibility: "community",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
          author: {
            id: "4",
            name: "Mike",
            address: "0xdef0",
          },
        },
      ]

      // Filter results based on visibility
      let filteredResults = mockResults
      if (visibility !== "all") {
        filteredResults = mockResults.filter((result) => result.visibility === visibility)
      }

      setResults(filteredResults)
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Error",
        description: "Failed to perform search",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Globe className="h-4 w-4" />
      case "community":
        return <Users className="h-4 w-4" />
      case "private":
        return <Lock className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const getVisibilityText = (visibility: string) => {
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Search</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="search-query" className="sr-only">
                  Search Query
                </Label>
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search-query"
                    type="search"
                    placeholder="Search pages..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-8"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch()
                      }
                    }}
                  />
                </div>
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Visibility</Label>
                <RadioGroup value={visibility} onValueChange={setVisibility} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="cursor-pointer">
                      All
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="flex items-center gap-1.5 cursor-pointer">
                      <Globe className="h-4 w-4" />
                      Public
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="community" id="community" />
                    <Label htmlFor="community" className="flex items-center gap-1.5 cursor-pointer">
                      <Users className="h-4 w-4" />
                      Community
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="flex items-center gap-1.5 cursor-pointer">
                      <Lock className="h-4 w-4" />
                      Private
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="language" className="text-sm font-medium mb-2 block">
                  Language
                </Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ru">Russian</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {searched && (
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-2">{loading ? "Searching..." : `${results.length} results found`}</h2>
          {!loading && results.length === 0 && (
            <p className="text-muted-foreground">No results found for your search query.</p>
          )}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid gap-4">
          {results.map((result) => (
            <Card key={result.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      <Link href={`/pages/${result.id}`} className="hover:underline">
                        {result.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      {getVisibilityIcon(result.visibility)}
                      <span>{getVisibilityText(result.visibility)}</span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(result.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="line-clamp-2 text-muted-foreground">{result.content}</p>
                <div className="flex items-center gap-2 mt-4">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xs">{result.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{result.author.name}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
