import { summarizeText } from "@/lib/openai"
import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/src/api/utils"

export async function POST(req: Request) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req)
    if (!auth.authenticated) return auth.error

    // Get request data
    const { content } = await req.json()

    // Validate required fields
    if (!content) {
      return errorResponse("Content is required")
    }

    // Summarize the content
    const summary = await summarizeText(content)

    return successResponse({
      summary,
    })
  } catch (error) {
    return handleApiError(error, "Failed to summarize content")
  }
}
