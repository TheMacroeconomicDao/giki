import type { NextRequest } from "next/server"
import { getPageById, getPageTranslations, addTranslation } from "@/lib/page-service"
import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/src/api/utils"

// GET /api/pages/[id]/translations - Get page translations
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

    // If the page is private, only admins and the author can view translations
    if (page.visibility === "private" && auth.user?.role !== "admin" && auth.user?.sub !== page.author.id) {
      return errorResponse("You don't have permission to access this page's translations", 403)
    }

    // Get page translations
    const translations = await getPageTranslations(params.id)

    return successResponse({ translations })
  } catch (error) {
    return handleApiError(error, "Failed to get page translations")
  }
}

// POST /api/pages/[id]/translations - Add page translation
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate the request (must be at least an editor to add translations)
    const auth = await authenticateRequest(req, "editor")
    if (!auth.authenticated) return auth.error

    // Get page by ID
    const page = await getPageById(params.id)

    if (!page) {
      return errorResponse("Page not found", 404)
    }

    // Get translation data
    const { language, content } = await req.json()

    // Validate required fields
    if (!language || !content) {
      return errorResponse("Missing required fields: language, content")
    }

    // Add translation
    const translation = await addTranslation({
      page_id: params.id,
      language,
      content,
    })

    if (!translation) {
      return errorResponse("Failed to add translation", 500)
    }

    return successResponse({ translation }, "Translation added successfully")
  } catch (error) {
    return handleApiError(error, "Failed to add translation")
  }
}
