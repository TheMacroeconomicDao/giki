import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/lib/api-utils"
import { updateUser } from "@/lib/user-service"

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

    // In a real implementation, you would upload the file to a storage service
    // like AWS S3, Cloudinary, or Vercel Blob Storage
    // For this example, we'll simulate a successful upload with a mock URL

    // Generate a mock avatar URL
    const timestamp = Date.now()
    const avatarUrl = `/api/avatar/${userId}?t=${timestamp}`

    // Update the user with the new avatar URL
    await updateUser(userId, { avatarUrl })

    return successResponse({ avatarUrl })
  } catch (error) {
    return handleApiError(error, "Failed to upload avatar")
  }
}
