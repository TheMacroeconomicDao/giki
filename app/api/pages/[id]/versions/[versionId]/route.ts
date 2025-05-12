import type { NextRequest } from "next/server"
import { getPageById, getPageVersion } from "@/lib/page-service"
import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/src/api/utils"

// GET /api/pages/[id]/versions/[versionId] - Get specific page version
export async function GET(req: NextRequest, { params }: { params: { id: string; versionId: string } }) {
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

    // Get specific page version
    const version = await getPageVersion(params.versionId)

    if (!version || version.page_id !== params.id) {
      return errorResponse("Version not found", 404)
    }

    return successResponse({ version })
  } catch (error) {
    return handleApiError(error, "Failed to get page version")
  }
}
