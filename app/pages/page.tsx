"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group"
import { Label } from "@/shared/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { PageGrid } from "@/components/page-grid"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams, useRouter } from "next/navigation"
import { BookOpen, Filter, Globe, Lock, Search, Users } from "lucide-react"
import Link from "next/link"

export default function PagesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const initialVisibility = searchParams.get("visibility") || "all"
  const initialAuthor = searchParams.get("author") || "all"
  const initialSearch = searchParams.get("search") || ""
  const initialSort = searchParams.get("sort") || "updated"

  const [pages, setPages] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [visibility, setVisibility] = useState(initialVisibility)
  const [author, setAuthor] = useState(initialAuthor)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [sort, setSort] = useState(initialSort)
  const [page, setPage] = useState(1)
  const limit = 12

  useEffect(() => {
    fetchPages()
  }, [visibility, author, sort, page])

  const fetchPages = async () => {
    try {
      setLoading(true)

      let url = `/api/pages?limit=${limit}&offset=${(page - 1) * limit}`

      if (visibility !== "all") {
        url += `&visibility=${visibility}`
      }

      if (author === "me") {
        url += `&author_id=self` // The API will resolve this to the current user
      }

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`
      }

      if (sort) {
        url += `&sort=${sort}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch pages")
      }

      const data = await response.json()
      setPages(data.data.pages)
      setTotal(data.data.total)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pages",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    updateUrl()
    fetchPages()
  }

  const updateUrl = () => {
    const params = new URLSearchParams()
    if (visibility !== "all") params.set("visibility", visibility)
    if (author !== "all") params.set("author", author)
    if (searchQuery) params.set("search", searchQuery)
    if (sort !== "updated") params.set("sort", sort)

    router.push(`/pages?${params.toString()}`)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Pages</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/create">Create Page</Link>
          </Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <Card className={showFilters ? "" : "hidden md:block"}>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search pages..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit">Search</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Visibility</Label>
                <RadioGroup
                  value={visibility}
                  onValueChange={(v) => {
                    setVisibility(v)
                    setPage(1)
                  }}
                >
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
                <Label htmlFor="author" className="text-sm font-medium mb-2 block">
                  Author
                </Label>
                <Select
                  value={author}
                  onValueChange={(v) => {
                    setAuthor(v)
                    setPage(1)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Authors</SelectItem>
                    <SelectItem value="me">My Pages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort" className="text-sm font-medium mb-2 block">
                  Sort By
                </Label>
                <Select
                  value={sort}
                  onValueChange={(v) => {
                    setSort(v)
                    setPage(1)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated">Last Updated</SelectItem>
                    <SelectItem value="created">Date Created</SelectItem>
                    <SelectItem value="views">Most Views</SelectItem>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : pages.length > 0 ? (
        <div className="space-y-6">
          <PageGrid pages={pages} showAuthor={true} />

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of {total} pages
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>
                Previous
              </Button>
              <Button variant="outline" onClick={() => setPage(page + 1)} disabled={page * limit >= total}>
                Next
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No pages found</h3>
          <p className="mt-2 text-muted-foreground">
            {searchQuery
              ? "No pages match your search criteria. Try adjusting your filters."
              : "No pages have been created yet."}
          </p>
          <Button className="mt-4" asChild>
            <Link href="/create">Create Page</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
