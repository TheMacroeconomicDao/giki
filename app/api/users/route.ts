import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { listUsers } from "@/lib/user-service"
import { authenticateRequest, handleApiError, successResponse } from "@/lib/api-utils"

// In a real implementation, this would connect to a database
// For now, we'll use an in-memory store
const users = [
  {
    id: "1",
    address: "0x1234567890abcdef1234567890abcdef12345678",
    name: "Admin User",
    email: "admin@giki.js",
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    preferences: {
      language: "en",
      theme: "system",
      emailNotifications: true,
    },
  },
  {
    id: "2",
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    name: "Editor User",
    email: "editor@giki.js",
    role: "editor",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    preferences: {
      language: "en",
      theme: "light",
      emailNotifications: true,
    },
  },
  {
    id: "3",
    address: "0x7890abcdef1234567890abcdef1234567890abcd",
    name: "Viewer User",
    email: "viewer@giki.js",
    role: "viewer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    preferences: {
      language: "es",
      theme: "dark",
      emailNotifications: false,
    },
  },
]

// GET /api/users - List users
export async function GET(req: NextRequest) {
  try {
    // Authenticate the request (only admins can list all users)
    const auth = await authenticateRequest(req, "admin")
    if (!auth.authenticated) return auth.error

    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const role = searchParams.get("role") || undefined
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)

    // Get users with filters
    const { users, total } = await listUsers({
      role,
      limit,
      offset,
    })

    return successResponse({
      users,
      total,
      limit,
      offset,
    })
  } catch (error) {
    return handleApiError(error, "Failed to list users")
  }
}

export async function POST(req: Request) {
  try {
    // In a real app, we would check authentication and authorization here
    // Only admins should be able to create users

    const { address, name, email, role } = await req.json()

    // Validate required fields
    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    // Check if user already exists
    if (users.some((user) => user.address.toLowerCase() === address.toLowerCase())) {
      return NextResponse.json({ error: "User with this address already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = {
      id: uuidv4(),
      address,
      name: name || null,
      email: email || null,
      role: role || "viewer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: null,
      preferences: {
        language: "en",
        theme: "system",
        emailNotifications: true,
      },
    }

    users.push(newUser)

    return NextResponse.json({ user: newUser })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
