import type { NextRequest } from "next/server"
import { sql } from "@/lib/db"
import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/lib/api-utils"
import { logger } from "@/lib/logger"

// POST /api/admin/restore - Restore database from JSON backup
export async function POST(req: NextRequest) {
  try {
    // Authenticate the request (only admins can restore backups)
    const auth = await authenticateRequest(req, "admin")
    if (!auth.authenticated) return auth.error

    // Get the backup data from the request
    let backup
    try {
      backup = await req.json()
    } catch (error) {
      return errorResponse("Invalid backup file format", 400)
    }

    // Validate backup structure
    if (!backup || !backup.users || !backup.pages || !backup.versions || !backup.translations || !backup.settings) {
      return errorResponse("Invalid backup structure", 400)
    }

    try {
      // Start a transaction
      await sql.query("BEGIN")

      // Clear existing data
      await sql.query("DELETE FROM translated_content")
      await sql.query("DELETE FROM page_versions")
      await sql.query("DELETE FROM pages")
      await sql.query("DELETE FROM user_preferences")
      await sql.query("DELETE FROM sessions")
      await sql.query("DELETE FROM users")
      await sql.query("DELETE FROM settings")

      // Restore users
      for (const user of backup.users) {
        await sql.query(
          `
          INSERT INTO users (id, address, name, email, role, created_at, updated_at, last_login)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING
        `,
          [user.id, user.address, user.name, user.email, user.role, user.created_at, user.updated_at, user.last_login],
        )

        // Restore user preferences
        if (user.language || user.theme || user.email_notifications !== undefined) {
          await sql.query(
            `
            INSERT INTO user_preferences (user_id, language, theme, email_notifications)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id) DO NOTHING
          `,
            [user.id, user.language || "en", user.theme || "system", user.email_notifications !== false],
          )
        }
      }

      // Restore pages
      for (const page of backup.pages) {
        await sql.query(
          `
          INSERT INTO pages (id, title, content, visibility, author_id, created_at, updated_at, views)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING
        `,
          [
            page.id,
            page.title,
            page.content,
            page.visibility,
            page.author_id,
            page.created_at,
            page.updated_at,
            page.views || 0,
          ],
        )
      }

      // Restore page versions
      for (const version of backup.versions) {
        await sql.query(
          `
          INSERT INTO page_versions (id, page_id, content, created_at, created_by)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO NOTHING
        `,
          [version.id, version.page_id, version.content, version.created_at, version.created_by],
        )
      }

      // Restore translations
      for (const translation of backup.translations) {
        await sql.query(
          `
          INSERT INTO translated_content (id, page_id, language, content, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO NOTHING
        `,
          [
            translation.id,
            translation.page_id,
            translation.language,
            translation.content,
            translation.created_at,
            translation.updated_at,
          ],
        )
      }

      // Restore settings
      for (const setting of backup.settings) {
        await sql.query(
          `
          INSERT INTO settings (key, value, description, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (key) DO UPDATE SET
            value = EXCLUDED.value,
            description = EXCLUDED.description,
            updated_at = EXCLUDED.updated_at
        `,
          [setting.key, setting.value, setting.description, setting.created_at, setting.updated_at],
        )
      }

      // Commit the transaction
      await sql.query("COMMIT")

      return successResponse({ success: true }, "Backup restored successfully")
    } catch (error) {
      // Rollback the transaction on error
      await sql.query("ROLLBACK")
      logger.error("Restore error:", error)
      return errorResponse(`Failed to restore backup: ${(error as Error).message}`, 500)
    }
  } catch (error) {
    return handleApiError(error, "Failed to restore backup")
  }
}
