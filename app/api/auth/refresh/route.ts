import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJWT, type JWTPayload, createAccessToken, getSecureCookieOptions } from "@/lib/jwt"
import { logger } from "@/lib/logger"

export async function POST(req: Request) {
  try {
    // Get the refresh token from cookies
    const cookieStore = cookies()
    const refreshToken = cookieStore.get("refresh_token")?.value

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token is required" }, { status: 400 })
    }

    try {
      // Verify the refresh token with clock tolerance
      const payload = await verifyJWT<JWTPayload>(refreshToken)

      if (payload.type !== "refresh") {
        throw new Error("Invalid token type")
      }

      // Create a new access token
      const accessToken = await createAccessToken({
        sub: payload.sub,
        address: payload.address,
        role: payload.role,
      })

      // Set the new access token cookie
      cookieStore.set(
        "access_token",
        accessToken,
        getSecureCookieOptions(15 * 60), // 15 minutes
      )

      return NextResponse.json({ success: true })
    } catch (error) {
      logger.error("Refresh token verification error:", error)

      // Invalid or expired refresh token
      cookieStore.delete("refresh_token")
      cookieStore.delete("access_token")

      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 })
    }
  } catch (error) {
    logger.error("Refresh token error:", error)
    return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 })
  }
}
