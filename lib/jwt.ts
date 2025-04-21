import { jwtVerify, SignJWT } from "jose"

// Secret key for JWT signing and verification
// In production, use a proper secret from environment variables
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-here-minimum-32-characters-long")

// Token expiration times
const ACCESS_TOKEN_EXPIRES_IN = "15m" // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = "7d" // 7 days

export interface JWTPayload {
  sub: string // User ID
  address: string // Wallet address
  role: string // User role
  jti?: string // JWT ID (for refresh tokens)
  type?: "access" | "refresh" // Token type
}

/**
 * Sign a JWT token
 */
export async function signJWT(payload: JWTPayload, expiresIn: string = ACCESS_TOKEN_EXPIRES_IN): Promise<string> {
  const iat = Math.floor(Date.now() / 1000) // Current time in seconds

  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET)

  return token
}

/**
 * Verify a JWT token
 */
export async function verifyJWT<T>(token: string): Promise<T> {
  try {
    // Add clock tolerance to handle slight time differences
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      clockTolerance: 120, // Increase to 120 seconds of clock tolerance for server time differences
    })
    return payload as unknown as T
  } catch (error) {
    console.error("JWT verification failed:", error)
    throw new Error("Invalid token")
  }
}

/**
 * Create an access token
 */
export async function createAccessToken(payload: Omit<JWTPayload, "type">): Promise<string> {
  return signJWT({ ...payload, type: "access" }, ACCESS_TOKEN_EXPIRES_IN)
}

/**
 * Create a refresh token
 */
export async function createRefreshToken(payload: Omit<JWTPayload, "type">): Promise<string> {
  // Add a unique JWT ID for this refresh token
  const jti = crypto.randomUUID()
  return signJWT({ ...payload, type: "refresh", jti }, REFRESH_TOKEN_EXPIRES_IN)
}

/**
 * Set secure cookie options
 */
export function getSecureCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  }
}
