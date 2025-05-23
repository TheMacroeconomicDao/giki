import { initializeDatabase } from "@/shared/lib/db/check"
import { initializeSettings } from "@/entities/settings"
import { logger } from "@/shared/lib/logger"

// Initialize the database and settings
export async function initialize() {
  try {
    logger.info("Initializing application...")

    // Check database connection
    await initializeDatabase()

    // Initialize settings
    await initializeSettings()

    logger.info("Application initialized successfully")
  } catch (error) {
    logger.error("Application initialization error:", error)
  }
}

// Call initialize but don't wait for it to complete
// This allows the app to start even if initialization is still in progress
initialize()
