import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { listUsers } from "@/lib/user-service"
import { authenticateRequest, handleApiError, successResponse } from "@/lib/api-utils"
import { getUsers, createUser } from "@/src/api/users"

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
export const GET = async (req: NextRequest) => getUsers(req)

export const POST = async (req: NextRequest) => createUser(req)
