import type { NextRequest } from "next/server"
import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/lib/api-utils"
import { updateUser, getUserById } from "@/lib/user-service"

// PATCH /api/users/profile - Update current user's profile
export async function PATCH(req: NextRequest) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req)
    if (!auth.authenticated) return auth.error

    // Get the current user's ID
    const userId = auth.user?.sub

    if (!userId) {
      return errorResponse("User ID not found", 404)
    }

    // Get update data
    const data = await req.json()

    // Validate update data
    if (!data) {
      return errorResponse("No update data provided")
    }

    // Only allow updating name, email, and preferences
    const allowedUpdates = {
      name: data.name,
      email: data.email,
      preferences: data.preferences,
    }

    // Update user
    const updatedUser = await updateUser(userId, allowedUpdates)

    if (!updatedUser) {
      return errorResponse("Failed to update user", 500)
    }

    return successResponse({ user: updatedUser })
  } catch (error) {
    return handleApiError(error, "Failed to update user profile")
  }
}

// GET /api/users/profile - Get current user's profile
export async function GET(req: NextRequest) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req)
    if (!auth.authenticated) return auth.error

    // Get the current user's ID
    const userId = auth.user?.sub

    if (!userId) {
      return errorResponse("User ID not found", 404)
    }

    // Get user by ID
    const user = await getUserById(userId)

    if (!user) {
      return errorResponse("User not found", 404)
    }

    return successResponse({ user })
  } catch (error) {
    return handleApiError(error, "Failed to get user profile")
  }
}
