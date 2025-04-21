import { query } from "@/lib/db"
import { logger } from "@/lib/logger"
import fs from "fs"
import path from "path"

async function runMigrations() {
  try {
    logger.info("Running database migrations...")

    // Read the migration file
    const migrationPath = path.join(process.cwd(), "init-db", "03-add-avatar-url.sql")
    const migrationSql = fs.readFileSync(migrationPath, "utf8")

    // Execute the migration
    await query(migrationSql, [])

    logger.info("Migrations completed successfully")
  } catch (error) {
    logger.error("Error running migrations:", error)
    process.exit(1)
  }
}

runMigrations()
  .then(() => {
    logger.info("Migration script completed")
    process.exit(0)
  })
  .catch((error) => {
    logger.error("Migration script failed:", error)
    process.exit(1)
  })
