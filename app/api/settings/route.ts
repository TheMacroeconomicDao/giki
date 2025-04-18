import { NextResponse } from "next/server"
import { getAllSettings, updateSettings, initializeSettings } from "@/lib/settings-service"
import { logger } from "@/lib/logger"

// Initialize settings on first request
let initialized = false

export async function GET(req: Request) {
  try {
    // Initialize settings if not already done
    if (!initialized) {
      await initializeSettings()
      initialized = true
    }

    // Get all settings
    const settings = await getAllSettings()

    // Create a safe version of settings without API keys
    const safeSettings = { ...settings }
    delete safeSettings.OPENAI_API_KEY
    delete safeSettings.GITHUB_TOKEN

    return NextResponse.json({ settings: safeSettings })
  } catch (error) {
    logger.error("Settings error:", error as Error)
    return NextResponse.json({ error: "Failed to get settings" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // In a real app, we would check authentication here
    // and validate that the user has admin permissions

    const { settings: newSettings } = await req.json()

    // Validate required settings
    if (!newSettings) {
      return NextResponse.json({ error: "No settings provided" }, { status: 400 })
    }

    // Update settings
    const success = await updateSettings(newSettings)

    if (!success) {
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }

    // Get updated settings
    const settings = await getAllSettings()

    // Create a safe version of settings without API keys
    const safeSettings = { ...settings }
    delete safeSettings.OPENAI_API_KEY
    delete safeSettings.GITHUB_TOKEN

    return NextResponse.json({ success: true, settings: safeSettings })
  } catch (error) {
    logger.error("Settings update error:", error as Error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
