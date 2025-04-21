import { authenticateRequest, handleApiError, successResponse } from "@/lib/api-utils"
import { query } from "@/lib/db"
import { logger } from "@/lib/logger"

export async function POST(req: Request) {
  try {
    // Authenticate the request and ensure admin role
    const auth = await authenticateRequest(req)
    if (!auth.authenticated) return auth.error

    if (auth.user?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Execute the migration SQL directly
    await query(
      `
      -- Add avatar_url column to user_preferences table if it doesn't exist
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1
              FROM information_schema.columns
              WHERE table_name = 'user_preferences' AND column_name = 'avatar_url'
          ) THEN
              ALTER TABLE user_preferences ADD COLUMN avatar_url TEXT;
          END IF;
      END $$;
    `,
      [],
    )

    logger.info("Migration completed successfully")

    return successResponse({ message: "Migration completed successfully" })
  } catch (error) {
    return handleApiError(error, "Failed to run migrations")
  }
}
