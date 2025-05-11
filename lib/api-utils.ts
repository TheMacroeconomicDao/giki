import { NextResponse } from "next/server"
import { logger } from "./logger"
import { cookies } from "next/headers"
import { verifyJWT, type JWTPayload } from "./jwt"

// Standard API response structure
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Helper function to create a successful response
export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  })
}

// Helper function to create an error response
export function errorResponse(error: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status },
  )
}

// Helper function to handle API errors
export function handleApiError(error: unknown, customMessage?: string): NextResponse<ApiResponse> {
  const message = customMessage || "An unexpected error occurred"
  logger.error(message, error)

  if (error instanceof Error) {
    return errorResponse(`${message}: ${error.message}`, 500)
  }

  return errorResponse(message, 500)
}

// Helper function to authenticate API requests
export async function authenticateRequest(
  req: Request,
  requiredRole?: "admin" | "editor" | "viewer",
): Promise<{ authenticated: boolean; user?: JWTPayload; error?: NextResponse<ApiResponse> }> {
  try {
    // Get the access token from cookies
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value

    if (!accessToken) {
      return {
        authenticated: false,
        error: errorResponse("Authentication required", 401),
      }
    }

    try {
      // Verify the access token
      const payload = await verifyJWT<JWTPayload>(accessToken)

      if (payload.type !== "access") {
        return {
          authenticated: false,
          error: errorResponse("Invalid token type", 401),
        }
      }

      // Check if the user has the required role
      if (requiredRole && payload.role !== "admin" && payload.role !== requiredRole) {
        return {
          authenticated: false,
          error: errorResponse("Insufficient permissions", 403),
        }
      }

      return {
        authenticated: true,
        user: payload,
      }
    } catch (error) {
      logger.error("Token verification error:", error)
      return {
        authenticated: false,
        error: errorResponse("Invalid or expired token", 401),
      }
    }
  } catch (error) {
    logger.error("Authentication error:", error)
    return {
      authenticated: false,
      error: errorResponse("Authentication failed", 500),
    }
  }
}
