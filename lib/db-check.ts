import { sql } from "./db"
import { logger } from "./logger"

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Try a simple query to check if the database connection works
    const result = await sql.query("SELECT 1 as connected")
    return result[0]?.connected === 1
  } catch (error) {
    logger.error("Database connection check failed:", error)
    return false
  }
}

// Add a function to initialize the database
export async function initializeDatabase(): Promise<void> {
  try {
    const isConnected = await checkDatabaseConnection()
    if (isConnected) {
      logger.info("Database connection successful")
    } else {
      logger.error("Database connection failed")
    }
  } catch (error) {
    logger.error("Database initialization error:", error)
  }
}
