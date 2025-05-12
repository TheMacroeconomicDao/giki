import { testGitHubConnection } from "@/shared/lib/github"
import { authenticateRequest, handleApiError, successResponse } from "@/src/api/utils"

export async function GET(req: Request) {
  try {
    // Authenticate the request (only admins can test GitHub connection)
    const auth = await authenticateRequest(req, "admin")
    if (!auth.authenticated) return auth.error

    // Test GitHub connection
    const result = await testGitHubConnection()

    return successResponse(result)
  } catch (error) {
    return handleApiError(error, "Failed to test GitHub connection")
  }
}
