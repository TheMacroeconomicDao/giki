import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJWT, type JWTPayload } from "@/lib/jwt"
import { getUserById } from "@/lib/user-service"

export async function GET(req: Request) {
  try {
    // Get the access token from cookies
    const cookieStore = cookies()
    const accessToken = cookieStore.get("access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    try {
      // Verify the access token
      const payload = await verifyJWT<JWTPayload>(accessToken)

      if (payload.type !== "access") {
        throw new Error("Invalid token type")
      }

      // Get the user
      const user = await getUserById(payload.sub)

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

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
      // Invalid or expired token
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
