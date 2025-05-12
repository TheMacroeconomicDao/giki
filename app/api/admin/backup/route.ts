import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/shared/lib/db"
import { authenticateRequest, handleApiError } from "@/src/api/utils"

// GET /api/admin/backup - Export database as JSON
export async function GET(req: NextRequest) {
  try {
    // Authenticate the request (only admins can create backups)
    const auth = await authenticateRequest(req, "admin")
    if (!auth.authenticated) return auth.error

    // Get all users
    const users = await sql.query(`
      SELECT u.*, p.language, p.theme, p.email_notifications
      FROM users u
      LEFT JOIN user_preferences p ON u.id = p.user_id
    `)

    // Get all pages
    const pages = await sql.query(`
      SELECT p.*, u.name as author_name, u.address as author_address
      FROM pages p
      JOIN users u ON p.author_id = u.id
    `)

    // Get all page versions
    const versions = await sql.query(`
      SELECT *
      FROM page_versions
    `)

    // Get all translations
    const translations = await sql.query(`
      SELECT *
      FROM translated_content
    `)

    // Get all settings
    const settings = await sql.query(`
      SELECT *
      FROM settings
    `)

    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      users,
      pages,
      versions,
      translations,
      settings,
    }

    // Set headers for file download
    const headers = new Headers()
    headers.set("Content-Type", "application/json")
    headers.set("Content-Disposition", `attachment; filename="giki-backup-${new Date().toISOString()}.json"`)

    // Return the backup as a downloadable JSON file
    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers,
    })
  } catch (error) {
    return handleApiError(error, "Failed to create backup")
  }
}
