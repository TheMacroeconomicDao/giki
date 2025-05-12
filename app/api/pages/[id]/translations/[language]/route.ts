import type { NextRequest } from "next/server"
import { getPageById, getTranslation, addTranslation } from "@/entities/page"
import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/src/api/utils"

// GET /api/pages/[id]/translations/[language] - Get specific translation
export async function GET(req: NextRequest, { params }: { params: { id: string; language: string } }) {
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

    // Get specific translation
    const translation = await getTranslation(params.id, params.language)

    if (!translation) {
      return errorResponse("Translation not found", 404)
    }

    return successResponse({ translation })
  } catch (error) {
    return handleApiError(error, "Failed to get translation")
  }
}

// PUT /api/pages/[id]/translations/[language] - Update specific translation
export async function PUT(req: NextRequest, { params }: { params: { id: string; language: string } }) {
  try {
    // Authenticate the request (must be at least an editor to update translations)
    const auth = await authenticateRequest(req, "editor")
    if (!auth.authenticated) return auth.error

    // Get page by ID
    const page = await getPageById(params.id)

    if (!page) {
      return errorResponse("Page not found", 404)
    }

    // Get translation data
    const { content } = await req.json()

    // Validate required fields
    if (!content) {
      return errorResponse("Missing required field: content")
    }

    // Update translation (using addTranslation with ON CONFLICT DO UPDATE)
    const translation = await addTranslation({
      page_id: params.id,
      language: params.language,
      content,
    })

    if (!translation) {
      return errorResponse("Failed to update translation", 500)
    }

    return successResponse({ translation }, "Translation updated successfully")
  } catch (error) {
    return handleApiError(error, "Failed to update translation")
  }
}
