import { translateText } from "@/shared/lib/openai"
import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/src/api/utils"

export async function POST(req: Request) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req)
    if (!auth.authenticated) return auth.error

    // Get request data
    const { content, targetLanguage } = await req.json()

    // Validate required fields
    if (!content) {
      return errorResponse("Content is required")
    }

    if (!targetLanguage) {
      return errorResponse("Target language is required")
    }

    // Translate the content
    const translatedText = await translateText(content, targetLanguage)

    return successResponse({
      translatedText,
    })
  } catch (error) {
    return handleApiError(error, "Failed to translate content")
  }
}
