import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJWT, type JWTPayload } from "@/shared/lib/jwt"
import { getUserSessions, deactivateSession } from "@/entities/user/model/session"
import { logger } from "@/shared/lib/logger"

export async function GET(req: Request) {
  try {
    // Get the refresh token from cookies
    const cookieStore = cookies()
    const refreshToken = cookieStore.get("refresh_token")?.value

    if (!refreshToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    try {
      // Verify the refresh token
      const payload = await verifyJWT<JWTPayload>(refreshToken)

      if (payload.type !== "refresh") {
        throw new Error("Invalid token type")
      }

      // Get user sessions
      const sessions = await getUserSessions(payload.sub)

      return NextResponse.json({ sessions })
    } catch (error) {
      // Invalid or expired token
      logger.error("Session token verification error:", error as Error)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    logger.error("Session error:", error as Error)
    return NextResponse.json({ error: "Session error" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { sessionId } = await req.json()

    // Get the refresh token from cookies
    const cookieStore = cookies()
    const refreshToken = cookieStore.get("refresh_token")?.value

    if (!refreshToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    try {
      // Verify the refresh token
      const payload = await verifyJWT<JWTPayload>(refreshToken)

      if (payload.type !== "refresh") {
        throw new Error("Invalid token type")
      }

      // Deactivate the session
      const success = await deactivateSession(sessionId)

      if (!success) {
        return NextResponse.json({ error: "Failed to terminate session" }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    } catch (error) {
      // Invalid or expired token
      logger.error("Session token verification error:", error as Error)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    logger.error("Session error:", error as Error)
    return NextResponse.json({ error: "Session error" }, { status: 500 })
  }
}
