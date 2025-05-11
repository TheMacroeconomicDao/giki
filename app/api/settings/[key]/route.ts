import { NextResponse } from "next/server"

// In a real implementation, this would connect to a database
// For now, we'll use the same in-memory store as in the main settings route
const settings: Record<string, string> = {
  SITE_NAME: "Giki.js",
  SITE_DESCRIPTION: "Next-Generation Wiki Platform",
  OPENAI_API_KEY: "",
  GITHUB_TOKEN: "",
  GITHUB_OWNER: "",
  GITHUB_REPO: "",
  DEFAULT_LANGUAGE: "en",
  ALLOWED_LANGUAGES: "en,es,fr,de,ru",
  ENABLE_PUBLIC_REGISTRATION: "true",
  ENABLE_GITHUB_SYNC: "true",
  ENABLE_AI_TRANSLATION: "true",
}

export async function GET(req: Request, { params }: { params: { key: string } }) {
  // In a real app, we would check authentication here
  const key = params.key

  if (!settings[key]) {
    return NextResponse.json({ error: "Setting not found" }, { status: 404 })
  }

  // Don't return sensitive settings without proper authentication
  if (["OPENAI_API_KEY", "GITHUB_TOKEN"].includes(key)) {
    return NextResponse.json({ error: "Unauthorized access to sensitive setting" }, { status: 403 })
  }

  return NextResponse.json({ [key]: settings[key] })
}

export async function PUT(req: Request, { params }: { params: { key: string } }) {
  try {
    // In a real app, we would check authentication here
    const key = params.key
    const { value } = await req.json()

    if (value === undefined) {
      return NextResponse.json({ error: "No value provided" }, { status: 400 })
    }

    // Update the setting
    settings[key] = value

    return NextResponse.json({ success: true, [key]: value })
  } catch (error) {
    console.error("Setting update error:", error)
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 })
  }
}
