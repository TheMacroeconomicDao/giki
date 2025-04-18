import type { NextRequest } from "next/server"
import { createPage, listPages } from "@/lib/page-service"
import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/lib/api-utils"

// GET /api/pages - List pages
export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const visibility = searchParams.get("visibility") || undefined
    const authorId = searchParams.get("author_id") || undefined
    const search = searchParams.get("search") || undefined
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)

    // Authenticate the request
    const auth = await authenticateRequest(req)

    // If not authenticated, only show public pages
    const visibilityFilter = auth.authenticated ? visibility : "public"

    // Get pages with filters
    const { pages, total } = await listPages({
      visibility: visibilityFilter,
      author_id: authorId,
      search,
      limit,
      offset,
    })

    return successResponse({
      pages,
      total,
      limit,
      offset,
    })
  } catch (error) {
    return handleApiError(error, "Failed to list pages")
  }
}

// POST /api/pages - Create page
export async function POST(req: NextRequest) {
  try {
    // Authenticate the request (must be at least an editor to create pages)
    const auth = await authenticateRequest(req, "editor")
    if (!auth.authenticated) return auth.error

    // Get page data
    const { title, content, visibility } = await req.json()

    // Validate required fields
    if (!title || !content || !visibility) {
      return errorResponse("Missing required fields: title, content, visibility")
    }

    // Create the page
    const page = await createPage({
      title,
      content,
      visibility,
      author_id: auth.user!.sub,
    })

    if (!page) {
      return errorResponse("Failed to create page", 500)
    }

    return successResponse({ page }, "Page created successfully")
  } catch (error) {
    return handleApiError(error, "Failed to create page")
  }
}
