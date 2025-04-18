import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    // Check database connection
    const dbStart = Date.now()
    const dbResult = await sql.query("SELECT 1 as connected")
    const dbTime = Date.now() - dbStart
    const dbConnected = dbResult[0]?.connected === 1

    // Get basic system stats
    const memoryUsage = process.memoryUsage()
    const uptime = process.uptime()

    // Get database stats
    const dbStats = await sql.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as user_count,
        (SELECT COUNT(*) FROM pages) as page_count,
        (SELECT COUNT(*) FROM sessions WHERE is_active = true) as active_sessions
    `)

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: uptime,
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + " MB",
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + " MB",
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + " MB",
      },
      database: {
        connected: dbConnected,
        responseTime: dbTime + " ms",
        stats: dbStats[0],
      },
    })
  } catch (error) {
    logger.error("Health check failed:", error as Error)
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
