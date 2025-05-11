import { NextResponse } from "next/server"
import { listPages, createPage } from "@/lib/page-service"
import { logger } from "@/lib/logger"
import { successResponse, errorResponse, handleApiError, authenticateRequest } from "@/lib/api-utils"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")
    const visibility = url.searchParams.get("visibility") || undefined
    const search = url.searchParams.get("search") || undefined
    const authorId = url.searchParams.get("author_id") || undefined

    // Get pages from database using service
    const { pages, total } = await listPages({
      visibility,
      author_id: authorId,
      limit,
      offset,
      search,
    })

    return successResponse({
      pages,
      total,
      limit,
      offset,
    })
  } catch (error) {
    logger.error("Error in pages API:", error as Error)
    return handleApiError(error, "Failed to fetch pages")
  }
}

// POST /api/pages - Create a new page
export async function POST(req: Request) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req)
    if (!auth.authenticated) return auth.error

    // Get request data
    const data = await req.json()

    // Validate required fields
    if (!data.title) {
      return errorResponse("Title is required")
    }

    if (!data.content) {
      return errorResponse("Content is required")
    }

    if (!data.visibility) {
      return errorResponse("Visibility is required")
    }

    // Create the page
    const page = await createPage({
      title: data.title,
      content: data.content,
      visibility: data.visibility,
      author_id: auth.user!.sub,
    })

    if (!page) {
      return errorResponse("Failed to create page", 500)
    }

    // Return created page with 201 status
    const response = successResponse({ page }, "Page created successfully")
    return new NextResponse(JSON.stringify(response.body), {
      status: 201,
      headers: response.headers
    })
  } catch (error) {
    logger.error("Error creating page:", error as Error)
    return handleApiError(error, "Failed to create page")
  }
}
