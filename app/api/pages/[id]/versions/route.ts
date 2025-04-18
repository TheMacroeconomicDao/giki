import type { NextRequest } from "next/server"
import { getPageById, getPageVersions } from "@/lib/page-service"
import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/lib/api-utils"

// GET /api/pages/[id]/versions - Get page versions
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get page by ID
    const page = await getPageById(params.id)

    if (!page) {
      return errorResponse("Page not found", 404)
    }

    // Authenticate the request
    const auth = await authenticateRequest(req)

    // Check if the user can access this page
    if (page.visibility !== "public" && !auth.authenticated) {
      return errorResponse("Authentication required to access this page", 401)
    }

    // If the page is private, only admins and the author can view versions
    if (page.visibility === "private" && auth.user?.role !== "admin" && auth.user?.sub !== page.author.id) {
      return errorResponse("You don't have permission to access this page's versions", 403)
    }

    // Get page versions
    const versions = await getPageVersions(params.id)

    return successResponse({ versions })
  } catch (error) {
    return handleApiError(error, "Failed to get page versions")
  }
}
