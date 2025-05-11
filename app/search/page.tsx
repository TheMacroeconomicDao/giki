"use client"

// Update the fetchPages function in the search page:
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function SearchPage() {
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [visibility, setVisibility] = useState("all")
  const [author, setAuthor] = useState("all")
  const [pages, setPages] = useState([])
  const [total, setTotal] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [sort, setSort] = useState("")

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

      try {
        const response = await fetch(url)

        if (!response.ok) {
          // If API fails, use mock data
          console.warn("API request failed, using mock data")

          // Mock data for demonstration
          const mockPages = [
            {
              id: "mock-1",
              title: "Mock Page 1",
              content: "This is mock content for testing purposes",
              visibility: "public",
              author: {
                id: "1",
                name: "Mock User",
                address: "0x1234",
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "mock-2",
              title: "Mock Page 2",
              content: "Another mock page for testing",
              visibility: "public",
              author: {
                id: "2",
                name: "Another User",
                address: "0x5678",
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ]

          setPages(mockPages)
          setTotal(mockPages.length)
          return
        }

        const data = await response.json()

        if (data.data && data.data.pages) {
          setPages(data.data.pages)
          setTotal(data.data.total)
        } else {
          // Fallback if data structure is unexpected
          console.warn("Unexpected API response structure")
          setPages([])
          setTotal(0)
        }
      } catch (error) {
        console.error("Error fetching pages:", error)
        // Use empty data on error
        setPages([])
        setTotal(0)

        toast({
          title: "Error",
          description: "Failed to load pages. Please try again later.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return <div>{/* Your search page content here */}</div>
}
