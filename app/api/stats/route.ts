import type { NextRequest } from "next/server"
import { sql } from "@/lib/db"
import { authenticateRequest, handleApiError, successResponse } from "@/lib/api-utils"

// GET /api/stats - Get application statistics
export async function GET(req: NextRequest) {
  try {
    // Authenticate the request (only admins can view statistics)
    const auth = await authenticateRequest(req, "admin")
    if (!auth.authenticated) return auth.error

    // Get user statistics
    const userStats = await sql.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
        COUNT(CASE WHEN role = 'editor' THEN 1 END) as editor_count,
        COUNT(CASE WHEN role = 'viewer' THEN 1 END) as viewer_count,
        MAX(created_at) as newest_user,
        COUNT(CASE WHEN last_login > NOW() - INTERVAL '7 days' THEN 1 END) as active_users_7d
      FROM users
    `)

    // Get page statistics
    const pageStats = await sql.query(`
      SELECT 
        COUNT(*) as total_pages,
        COUNT(CASE WHEN visibility = 'public' THEN 1 END) as public_pages,
        COUNT(CASE WHEN visibility = 'community' THEN 1 END) as community_pages,
        COUNT(CASE WHEN visibility = 'private' THEN 1 END) as private_pages,
        MAX(created_at) as newest_page,
        SUM(views) as total_views
      FROM pages
    `)

    // Get version statistics
    const versionStats = await sql.query(`
      SELECT 
        COUNT(*) as total_versions,
        COUNT(DISTINCT page_id) as pages_with_versions,
        MAX(created_at) as newest_version
      FROM page_versions
    `)

    // Get translation statistics
    const translationStats = await sql.query(`
      SELECT 
        COUNT(*) as total_translations,
        COUNT(DISTINCT page_id) as pages_with_translations,
        COUNT(DISTINCT language) as language_count
      FROM translated_content
    `)

    // Get session statistics
    const sessionStats = await sql.query(`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_sessions,
        COUNT(DISTINCT user_id) as users_with_sessions,
        MAX(last_active) as last_activity
      FROM sessions
    `)

    return successResponse({
      users: userStats[0],
      pages: pageStats[0],
      versions: versionStats[0],
      translations: translationStats[0],
      sessions: sessionStats[0],
    })
  } catch (error) {
    return handleApiError(error, "Failed to get statistics")
  }
}
