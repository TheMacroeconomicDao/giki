import { sql } from "@/lib/db"
import { logger } from "@/lib/logger"

async function seedDatabase() {
  try {
    logger.info("Starting database seeding...")

    // Check if we already have users
    const existingUsers = await sql.query("SELECT COUNT(*) as count FROM users")
    if (existingUsers[0].count > 0) {
      logger.info("Database already has users, skipping seeding")
      return
    }

    // Create admin user
    const adminUser = await sql.query(`
      INSERT INTO users (address, name, email, role)
      VALUES ('0x8ba1f109551bD432803012645Ac136ddd64DBA72', 'Admin User', 'admin@giki.js', 'admin')
      RETURNING id
    `)

    const adminId = adminUser[0].id

    // Create admin preferences
    await sql.query(
      `
      INSERT INTO user_preferences (user_id, language, theme, email_notifications)
      VALUES ($1, 'en', 'dark', true)
    `,
      [adminId],
    )

    // Create editor user
    const editorUser = await sql.query(`
      INSERT INTO users (address, name, email, role)
      VALUES ('0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 'Editor User', 'editor@giki.js', 'editor')
      RETURNING id
    `)

    const editorId = editorUser[0].id

    // Create editor preferences
    await sql.query(
      `
      INSERT INTO user_preferences (user_id, language, theme, email_notifications)
      VALUES ($1, 'en', 'system', true)
    `,
      [editorId],
    )

    // Create viewer user
    const viewerUser = await sql.query(`
      INSERT INTO users (address, name, email, role)
      VALUES ('0xFABB0ac9d68B0B445fB7357272Ff202C5651694a', 'Viewer User', 'viewer@giki.js', 'viewer')
      RETURNING id
    `)

    const viewerId = viewerUser[0].id

    // Create viewer preferences
    await sql.query(
      `
      INSERT INTO user_preferences (user_id, language, theme, email_notifications)
      VALUES ($1, 'en', 'light', false)
    `,
      [viewerId],
    )

    // Create welcome page
    const welcomePage = await sql.query(
      `
      INSERT INTO pages (title, content, visibility, author_id)
      VALUES ('Welcome to Giki.js', 'This is the welcome page for Giki.js, a next-generation wiki platform.', 'public', $1)
      RETURNING id
    `,
      [adminId],
    )

    const welcomePageId = welcomePage[0].id

    // Create welcome page version
    await sql.query(
      `
      INSERT INTO page_versions (page_id, content, created_by)
      VALUES ($1, 'This is the welcome page for Giki.js, a next-generation wiki platform.', $2)
    `,
      [welcomePageId, adminId],
    )

    // Create getting started page
    const gettingStartedPage = await sql.query(
      `
      INSERT INTO pages (title, content, visibility, author_id)
      VALUES ('Getting Started', 'This guide will help you get started with Giki.js.', 'public', $1)
      RETURNING id
    `,
      [editorId],
    )

    const gettingStartedPageId = gettingStartedPage[0].id

    // Create getting started page version
    await sql.query(
      `
      INSERT INTO page_versions (page_id, content, created_by)
      VALUES ($1, 'This guide will help you get started with Giki.js.', $2)
    `,
      [gettingStartedPageId, editorId],
    )

    // Create private page
    const privatePage = await sql.query(
      `
      INSERT INTO pages (title, content, visibility, author_id)
      VALUES ('Private Notes', 'These are private notes only visible to admins.', 'private', $1)
      RETURNING id
    `,
      [adminId],
    )

    const privatePageId = privatePage[0].id

    // Create private page version
    await sql.query(
      `
      INSERT INTO page_versions (page_id, content, created_by)
      VALUES ($1, 'These are private notes only visible to admins.', $2)
    `,
      [privatePageId, adminId],
    )

    // Create translated content
    await sql.query(
      `
      INSERT INTO translated_content (page_id, language, content)
      VALUES ($1, 'es', 'Esta es la página de bienvenida para Giki.js, una plataforma wiki de próxima generación.')
    `,
      [welcomePageId],
    )

    // Initialize settings
    const settings = [
      { key: "SITE_NAME", value: "Giki.js", description: "The name of the site" },
      {
        key: "SITE_DESCRIPTION",
        value: "Next-Generation Wiki Platform",
        description: "A short description of the site",
      },
      { key: "DEFAULT_LANGUAGE", value: "en", description: "The default language for the site" },
      { key: "ALLOWED_LANGUAGES", value: "en,es,fr,de,ru", description: "Comma-separated list of allowed languages" },
      { key: "ENABLE_PUBLIC_REGISTRATION", value: "true", description: "Whether to allow public registration" },
      { key: "ENABLE_GITHUB_SYNC", value: "true", description: "Whether to enable GitHub synchronization" },
      { key: "ENABLE_AI_TRANSLATION", value: "true", description: "Whether to enable AI translation" },
    ]

    for (const setting of settings) {
      await sql.query(
        `
        INSERT INTO settings (key, value, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (key) DO NOTHING
      `,
        [setting.key, setting.value, setting.description],
      )
    }

    logger.info("Database seeding completed successfully")
  } catch (error) {
    logger.error("Database seeding error:", error)
  }
}

// Execute the seeding function
seedDatabase()
