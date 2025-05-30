import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJWT, type JWTPayload } from "@/shared/lib/jwt"
import { logger } from "@/shared/lib/logger"

// Paths that require authentication
const protectedPaths = ["/admin", "/dashboard", "/settings", "/create"]

// Paths that require admin role
const adminPaths = ["/admin"]

// Paths that are exempt from authentication checks
const publicPaths = ["/api/auth/login", "/api/auth/refresh", "/api/auth/logout", "/_next", "/favicon.ico"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip authentication for public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // Get the access token from cookies
  const accessToken = request.cookies.get("access_token")?.value

  // If there's no access token and the path is protected, redirect to login
  if (!accessToken) {
    return NextResponse.redirect(new URL("/?login=required", request.url))
  }

  try {
    // Verify the access token with increased clock tolerance
    const payload = await verifyJWT<JWTPayload>(accessToken)

    if (payload.type !== "access") {
      throw new Error("Invalid token type")
    }

    // Check if the path requires admin role
    const isAdminPath = adminPaths.some((path) => pathname.startsWith(path))

    if (isAdminPath && payload.role !== "admin") {
      // If the user is not an admin and the path requires admin role, redirect to home
      return NextResponse.redirect(new URL("/?access=denied", request.url))
    }

    // User is authenticated and authorized
    return NextResponse.next()
  } catch (error) {
    // Используем logger вместо console.error
    logger.error(`Token verification error: ${error instanceof Error ? error.message : String(error)}`)

    // Try to refresh the token
    const refreshToken = request.cookies.get("refresh_token")?.value

    if (refreshToken) {
      // Redirect to token refresh endpoint
      // After refresh, the user will be redirected back to the original URL
      // Проверяем, что URL не undefined и он является строкой
      const originalUrl = request.url && typeof request.url === 'string' ? request.url : '/'
      const targetUrl = new URL("/api/auth/refresh", request.url)
      
      // Добавляем параметр redirect, только если URL валидный
      if (originalUrl && originalUrl !== '/undefined') {
        targetUrl.searchParams.set('redirect', originalUrl) 
      }
      
      return NextResponse.redirect(targetUrl)
    }

    // No refresh token or refresh failed, redirect to login
    return NextResponse.redirect(new URL("/?login=expired", request.url))
  }
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
