import { query, queryOne } from "@/lib/db"
import { logger } from "@/lib/logger"

export interface Setting {
  key: string
  value: string
  description: string | null
  created_at: string
  updated_at: string
}

// Default settings
const DEFAULT_SETTINGS: Record<string, { value: string; description: string }> = {
  SITE_NAME: {
    value: "Giki.js",
    description: "The name of the site",
  },
  SITE_DESCRIPTION: {
    value: "Next-Generation Wiki Platform",
    description: "A short description of the site",
  },
  DEFAULT_LANGUAGE: {
    value: "en",
    description: "The default language for the site",
  },
  ALLOWED_LANGUAGES: {
    value: "en,es,fr,de,ru",
    description: "Comma-separated list of allowed languages",
  },
  ENABLE_PUBLIC_REGISTRATION: {
    value: "true",
    description: "Whether to allow public registration",
  },
  ENABLE_GITHUB_SYNC: {
    value: "true",
    description: "Whether to enable GitHub synchronization",
  },
  ENABLE_AI_TRANSLATION: {
    value: "true",
    description: "Whether to enable AI translation",
  },
}

// Initialize settings in the database
export async function initializeSettings(): Promise<void> {
  try {
    for (const [key, { value, description }] of Object.entries(DEFAULT_SETTINGS)) {
      await query(
        `
        INSERT INTO settings (key, value, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (key) DO NOTHING
      `,
        [key, value, description],
      )
    }
  } catch (error) {
    logger.error("Error initializing settings:", error as Error)
  }
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    const setting = await queryOne<Setting>(
      `
      SELECT value
      FROM settings
      WHERE key = $1
    `,
      [key],
    )

    return setting?.value || null
  } catch (error) {
    logger.error(`Error getting setting ${key}:`, error as Error)
    return DEFAULT_SETTINGS[key]?.value || null
  }
}

export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const settings = await query<Setting>(`
      SELECT key, value
      FROM settings
    `)

    const settingsMap: Record<string, string> = {}
    settings.forEach((setting) => {
      settingsMap[setting.key] = setting.value
    })

    // Fill in any missing settings with defaults
    for (const [key, { value }] of Object.entries(DEFAULT_SETTINGS)) {
      if (!settingsMap[key]) {
        settingsMap[key] = value
      }
    }

    return settingsMap
  } catch (error) {
    logger.error("Error getting all settings:", error as Error)

    // Return default settings if there's an error
    const defaultValues: Record<string, string> = {}
    for (const [key, { value }] of Object.entries(DEFAULT_SETTINGS)) {
      defaultValues[key] = value
    }
    return defaultValues
  }
}

export async function updateSetting(key: string, value: string): Promise<boolean> {
  try {
    await query(
      `
      INSERT INTO settings (key, value)
      VALUES ($1, $2)
      ON CONFLICT (key) 
      DO UPDATE SET 
        value = EXCLUDED.value,
        updated_at = NOW()
    `,
      [key, value],
    )

    return true
  } catch (error) {
    logger.error(`Error updating setting ${key}:`, error as Error)
    return false
  }
}

export async function updateSettings(settings: Record<string, string>): Promise<boolean> {
  try {
    for (const [key, value] of Object.entries(settings)) {
      await updateSetting(key, value)
    }
    return true
  } catch (error) {
    logger.error("Error updating settings:", error as Error)
    return false
  }
}
