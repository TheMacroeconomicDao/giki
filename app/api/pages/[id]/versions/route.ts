import { NextResponse } from "next/server"
import { getPageVersions, getPageById } from "@/lib/page-service"
import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/src/api/utils"
import { logger } from "@/shared/lib/logger"

// GET /api/pages/[id]/versions - Get all versions of a page
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Get the page to check permissions
    const page = await getPageById(params.id)

    if (!page) {
      return errorResponse("Page not found", 404)
    }

    // Authenticate the request
    const auth = await authenticateRequest(req)

    // Check if the user can access this page's versions
    if (page.visibility !== "public" && !auth.authenticated) {
      return errorResponse("Authentication required to access version history", 401)
    }

    // If the page is private, only admins and the author can view versions
    if (page.visibility === "private" && auth.user?.role !== "admin" && auth.user?.sub !== page.author.id) {
      return errorResponse("You don't have permission to access this page's version history", 403)
    }

    // Get versions
    const versions = await getPageVersions(params.id)

    // Format data with author info
    const formattedVersions = versions.map(version => ({
      id: version.id,
      pageId: version.page_id,
      content: version.content,
      createdAt: version.created_at,
      createdBy: version.created_by,
      // In a real implementation, you would fetch author info for each version
      authorName: page.author.name // For simplicity, use page.author info
    }))

    return successResponse({ versions: formattedVersions })
  } catch (error) {
    logger.error("Error getting page versions:", error as Error)
    return handleApiError(error, "Failed to get version history")
  }
}
