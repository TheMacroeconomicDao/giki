import type { NextRequest } from "next/server"
import { getUserById, updateUser, deleteUser } from "@/lib/user-service"
import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/lib/api-utils"

// GET /api/users/[id] - Get user by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req)
    if (!auth.authenticated) return auth.error

    // Only admins can view other users, users can view themselves
    if (auth.user?.sub !== params.id && auth.user?.role !== "admin") {
      return errorResponse("Insufficient permissions", 403)
    }

    // Get user by ID
    const user = await getUserById(params.id)

    if (!user) {
      return errorResponse("User not found", 404)
    }

    return successResponse({ user })
  } catch (error) {
    return handleApiError(error, "Failed to get user")
  }
}

// PATCH /api/users/[id] - Update user
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req)
    if (!auth.authenticated) return auth.error

    // Only admins can update other users, users can update themselves
    if (auth.user?.sub !== params.id && auth.user?.role !== "admin") {
      return errorResponse("Insufficient permissions", 403)
    }

    // Get update data
    const data = await req.json()

    // Validate update data
    if (!data) {
      return errorResponse("No update data provided")
    }

    // Only admins can update roles
    if (data.role && auth.user?.role !== "admin") {
      return errorResponse("Insufficient permissions to update role", 403)
    }

    // Update user
    const updatedUser = await updateUser(params.id, data)

    if (!updatedUser) {
      return errorResponse("Failed to update user", 500)
    }

    return successResponse({ user: updatedUser })
  } catch (error) {
    return handleApiError(error, "Failed to update user")
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate the request (only admins can delete users)
    const auth = await authenticateRequest(req, "admin")
    if (!auth.authenticated) return auth.error

    // Delete user
    const success = await deleteUser(params.id)

    if (!success) {
      return errorResponse("Failed to delete user", 500)
    }

    return successResponse({ success: true }, "User deleted successfully")
  } catch (error) {
    return handleApiError(error, "Failed to delete user")
  }
}
