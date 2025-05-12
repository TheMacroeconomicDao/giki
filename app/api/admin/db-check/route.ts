import { NextResponse } from "next/server"
import { sql } from "@/shared/lib/db"
import { logger } from "@/shared/lib/logger"

export async function GET(req: Request) {
  try {
    // Try a simple query to check if the database connection works
    const result = await sql.query("SELECT 1 as connected")

    if (result[0]?.connected === 1) {
      // If the connection works, get some basic stats
      const userCount = await sql.query("SELECT COUNT(*) as count FROM users")
      const pageCount = await sql.query("SELECT COUNT(*) as count FROM pages")
      const sessionCount = await sql.query("SELECT COUNT(*) as count FROM sessions")

      return NextResponse.json({
        success: true,
        message: "Database connection successful",
        stats: {
          users: userCount[0].count,
          pages: pageCount[0].count,
          sessions: sessionCount[0].count,
        },
      })
    } else {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }
  } catch (error) {
    logger.error("Database connection check failed:", error)
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
  }
}
