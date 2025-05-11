import type { NextRequest } from "next/server"
import { getPageById, updatePage, deletePage, incrementPageViews } from "@/lib/page-service"
import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/lib/api-utils"

// GET /api/pages/[id] - Get page by ID
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

    // If the page is private, only admins and the author can view it
    if (page.visibility === "private" && auth.user?.role !== "admin" && auth.user?.sub !== page.author.id) {
      return errorResponse("You don't have permission to access this page", 403)
    }

    // Increment page views
    await incrementPageViews(params.id)

    return successResponse({ page })
  } catch (error) {
    return handleApiError(error, "Failed to get page")
  }
}

// PATCH /api/pages/[id] - Update page
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req)
    if (!auth.authenticated) return auth.error

    // Get page by ID
    const page = await getPageById(params.id)

    if (!page) {
      return errorResponse("Page not found", 404)
    }

    // Check if the user can edit this page
    if (auth.user?.role !== "admin" && auth.user?.sub !== page.author.id) {
      return errorResponse("You don't have permission to edit this page", 403)
    }

    // Get update data
    const data = await req.json()

    // Validate update data
    if (!data) {
      return errorResponse("No update data provided")
    }

    // Update page
    const updatedPage = await updatePage(params.id, data, auth.user!.sub)

    if (!updatedPage) {
      return errorResponse("Failed to update page", 500)
    }

    return successResponse({ page: updatedPage }, "Page updated successfully")
  } catch (error) {
    return handleApiError(error, "Failed to update page")
  }
}

// DELETE /api/pages/[id] - Delete page
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req)
    if (!auth.authenticated) return auth.error

    // Get page by ID
    const page = await getPageById(params.id)

    if (!page) {
      return errorResponse("Page not found", 404)
    }

    // Check if the user can delete this page
    if (auth.user?.role !== "admin" && auth.user?.sub !== page.author.id) {
      return errorResponse("You don't have permission to delete this page", 403)
    }

    // Delete page
    const success = await deletePage(params.id)

    if (!success) {
      return errorResponse("Failed to delete page", 500)
    }

    return successResponse({ success: true }, "Page deleted successfully")
  } catch (error) {
    return handleApiError(error, "Failed to delete page")
  }
}
