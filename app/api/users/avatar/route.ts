import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/lib/api-utils"
import { updateUser } from "@/lib/user-service"
import { logger } from "@/lib/logger"

export async function POST(req: Request) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req)
    if (!auth.authenticated) return auth.error

    // Get the current user's ID
    const userId = auth.user?.sub

    if (!userId) {
      return errorResponse("User ID not found", 404)
    }

    // Process the form data
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return errorResponse("No file provided", 400)
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return errorResponse("Invalid file type. Only images are allowed.", 400)
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return errorResponse("File too large. Maximum size is 5MB.", 400)
    }

    try {
      // Convert the file to a data URL
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64 = buffer.toString("base64")
      const dataUrl = `data:${file.type};base64,${base64}`

      // Update the user with the avatar URL - используем прямое поле avatarUrl вместо preferences.avatar_url
      const updatedUser = await updateUser(userId, {
        avatarUrl: dataUrl
      })

      if (!updatedUser) {
        throw new Error("Failed to update user with avatar")
      }

      // Return the data URL to the client
      return successResponse({ 
        avatarUrl: dataUrl,
        message: "Avatar uploaded successfully" 
      })
    } catch (error) {
      logger.error("Error updating user with avatar:", error)
      
      // Return the data URL anyway so the client can use localStorage as fallback
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64 = buffer.toString("base64")
      const dataUrl = `data:${file.type};base64,${base64}`
      
      return successResponse({ 
        avatarUrl: dataUrl,
        message: "Avatar processed but not saved to database. Using client-side storage as fallback.",
        useLocalStorage: true
      })
    }
  } catch (error) {
    return handleApiError(error, "Failed to upload avatar")
  }
}
