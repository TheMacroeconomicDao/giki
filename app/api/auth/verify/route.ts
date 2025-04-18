import { NextResponse } from "next/server"
// Remove: import { verify } from "jsonwebtoken"

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Simple token verification
    // In a real app, use a proper JWT library
    try {
      const decodedJson = Buffer.from(token, "base64").toString()
      const decoded = JSON.parse(decodedJson)

      // Check if token is expired
      if (decoded.exp < Date.now()) {
        throw new Error("Token expired")
      }

      return NextResponse.json({
        valid: true,
        decoded,
      })
    } catch (e) {
      return NextResponse.json({ valid: false, error: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ valid: false, error: "Invalid token" }, { status: 401 })
  }
}
