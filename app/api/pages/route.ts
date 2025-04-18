import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")
    const visibility = url.searchParams.get("visibility")
    const search = url.searchParams.get("search")

    // Generate mock pages
    const mockPages = Array.from({ length: 10 }, (_, i) => ({
      id: `mock-${i + offset + 1}`,
      title: `Mock Page ${i + offset + 1}${search ? ` - ${search}` : ""}`,
      content: `This is mock content for page ${i + offset + 1}`,
      visibility: visibility || (i % 3 === 0 ? "public" : i % 3 === 1 ? "community" : "private"),
      author: {
        id: "mock-user",
        name: "Mock User",
        address: "0x1234567890abcdef1234567890abcdef12345678",
      },
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - i * 43200000).toISOString(),
      views: Math.floor(Math.random() * 1000),
    }))

    // Filter by visibility if specified
    const filteredPages = visibility ? mockPages.filter((page) => page.visibility === visibility) : mockPages

    // Filter by search if specified
    const searchedPages = search
      ? filteredPages.filter(
          (page) =>
            page.title.toLowerCase().includes(search.toLowerCase()) ||
            page.content.toLowerCase().includes(search.toLowerCase()),
        )
      : filteredPages

    // Apply pagination
    const paginatedPages = searchedPages.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: {
        pages: paginatedPages,
        total: 50, // Mock total count
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error("Error in pages API:", error)
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
  }
}
