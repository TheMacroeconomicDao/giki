import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJWT, type JWTPayload } from "@/lib/jwt"

// In-memory session store (same as in login route)
interface Session {
  id: string
  userId: string
  userAgent: string
  ip: string
  createdAt: Date
  lastActive: Date
  isActive: boolean
}

// This should be the same sessions array as in login route
// In a real app, this would be stored in a database
const sessions: Session[] = []

export async function POST(req: Request) {
  try {
    // Get the refresh token from cookies
    const cookieStore = cookies()
    const refreshToken = cookieStore.get("refresh_token")?.value

    if (refreshToken) {
      try {
        // Verify the refresh token
        const payload = await verifyJWT<JWTPayload>(refreshToken)

        // Find and deactivate the session
        const userSessions = sessions.filter((session) => session.userId === payload.sub && session.isActive)

        for (const session of userSessions) {
          session.isActive = false
        }
      } catch (error) {
        // Ignore token verification errors during logout
        console.error("Token verification error during logout:", error)
      }
    }

    // Clear cookies regardless of token verification
    cookieStore.delete("access_token")
    cookieStore.delete("refresh_token")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
  }
}
