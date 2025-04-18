import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createAccessToken, createRefreshToken, getSecureCookieOptions } from "@/lib/jwt"
import { verifySignature } from "@/lib/web3"
import { getUserByAddress, createUser, updateLastLogin } from "@/lib/user-service"
import { createSession } from "@/lib/session-service"
import { logger } from "@/lib/logger"

export async function POST(req: Request) {
  try {
    const { address, signature, message } = await req.json()

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    // In a real app, verify the signature
    if (signature && message) {
      const isValidSignature = await verifySignature(address, signature, message)
      if (!isValidSignature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    // Find user by address
    let user = await getUserByAddress(address)

    // If user doesn't exist, create a new one
    if (!user) {
      user = await createUser({
        address,
        role: "viewer", // Default role for new users
      })

      if (!user) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
      }
    } else {
      // Update last login time
      await updateLastLogin(user.id)
    }

    // Create access and refresh tokens with proper expiration
    const accessToken = await createAccessToken({
      sub: user.id,
      address: user.address,
      role: user.role,
    })

    const refreshToken = await createRefreshToken({
      sub: user.id,
      address: user.address,
      role: user.role,
    })

    // Calculate expiration date (7 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Create a new session
    const session = await createSession({
      user_id: user.id,
      refresh_token: refreshToken,
      user_agent: req.headers.get("user-agent") || undefined,
      ip_address: req.headers.get("x-forwarded-for") || undefined,
      expires_at: expiresAt,
    })

    if (!session) {
      logger.error("Failed to create session for user", { userId: user.id })
    }

    // Set cookies
    const cookieStore = cookies()

    // Set access token cookie (short-lived)
    cookieStore.set(
      "access_token",
      accessToken,
      getSecureCookieOptions(15 * 60), // 15 minutes
    )

    // Set refresh token cookie (long-lived)
    cookieStore.set(
      "refresh_token",
      refreshToken,
      getSecureCookieOptions(7 * 24 * 60 * 60), // 7 days
    )

    return NextResponse.json({
      user: {
        id: user.id,
        address: user.address,
        name: user.name,
        email: user.email,
        role: user.role,
        preferences: user.preferences,
      },
    })
  } catch (error) {
    logger.error("Login error:", error as Error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
