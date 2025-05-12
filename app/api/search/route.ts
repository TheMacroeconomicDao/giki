import type { NextRequest } from "next/server"
import { sql } from "@/shared/lib/db"
import { authenticateRequest, handleApiError, successResponse } from "@/src/api/utils"

// GET /api/search - Search pages and content
export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)

    // Authenticate the request
    const auth = await authenticateRequest(req)

    // Build the visibility condition based on authentication
    let visibilityCondition = "p.visibility = 'public'"
    if (auth.authenticated) {
      if (auth.user?.role === "admin") {
        // Admins can see all pages
        visibilityCondition = "TRUE"
      } else {
        // Authenticated users can see public and community pages, plus their own private pages
        visibilityCondition = `(p.visibility = 'public' OR p.visibility = 'community' OR (p.visibility = 'private' AND p.author_id = '${auth.user?.sub}'))`
      }
    }

    // Search pages
    const results = await sql.query(
      `
      SELECT 
        p.*,
        u.id as author_id,
        u.name as author_name,
        u.address as author_address,
        ts_rank_cd(
          setweight(to_tsvector('english', p.title), 'A') || 
          setweight(to_tsvector('english', p.content), 'B'),
          plainto_tsquery('english', $1)
        ) as rank
      FROM pages p
      JOIN users u ON p.author_id = u.id
      WHERE (${visibilityCondition})
        AND (
          to_tsvector('english', p.title) || 
          to_tsvector('english', p.content)
        ) @@ plainto_tsquery('english', $1)
      ORDER BY rank DESC
      LIMIT $2 OFFSET $3
    `,
      [query, limit, offset],
    )

    // Get total count
    const countResult = await sql.query(
      `
      SELECT COUNT(*) as count
      FROM pages p
      WHERE (${visibilityCondition})
        AND (
          to_tsvector('english', p.title) || 
          to_tsvector('english', p.content)
        ) @@ plainto_tsquery('english', $1)
    `,
      [query],
    )

    const total = Number.parseInt(countResult[0]?.count || "0", 10)

    // Format results
    const formattedResults = results.map((page: any) => ({
      ...page,
      author: {
        id: page.author_id,
        name: page.author_name,
        address: page.author_address,
      },
    }))

    return successResponse({
      results: formattedResults,
      total,
      limit,
      offset,
    })
  } catch (error) {
    return handleApiError(error, "Failed to search")
  }
}
