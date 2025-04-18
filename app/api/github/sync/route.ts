import { syncPagesToGitHub, testGitHubConnection, createRepositoryIfNeeded } from "@/lib/github"
import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/lib/api-utils"
import { listPages } from "@/lib/page-service"

export async function POST(req: Request) {
  try {
    // Authenticate the request (only admins can sync to GitHub)
    const auth = await authenticateRequest(req, "admin")
    if (!auth.authenticated) return auth.error

    // Get request data
    const { pageIds } = await req.json()

    // Test GitHub connection
    const connectionTest = await testGitHubConnection()
    if (!connectionTest.success) {
      return errorResponse(`GitHub connection failed: ${connectionTest.error}`)
    }

    // Create repository if needed
    const repoCheck = await createRepositoryIfNeeded()
    if (!repoCheck.success) {
      return errorResponse(`Failed to create GitHub repository: ${repoCheck.error}`)
    }

    // Get pages to sync
    let pages = []
    if (pageIds && Array.isArray(pageIds) && pageIds.length > 0) {
      // Sync specific pages
      const pagesPromises = pageIds.map(async (id) => {
        const page = await fetch(`${req.url.split("/api/")[0]}/api/pages/${id}`).then((res) => res.json())
        return page.data?.page
      })

      pages = (await Promise.all(pagesPromises)).filter(Boolean)
    } else {
      // Sync all public pages
      const { pages: allPages } = await listPages({ visibility: "public" })
      pages = allPages
    }

    if (pages.length === 0) {
      return errorResponse("No pages found to sync")
    }

    // Sync pages to GitHub
    const syncResults = await syncPagesToGitHub(pages)

    return successResponse(syncResults)
  } catch (error) {
    return handleApiError(error, "Failed to sync with GitHub")
  }
}
