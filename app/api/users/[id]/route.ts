import type { NextRequest } from "next/server"
import { getUser, updateUser, deleteUser } from "@/src/api/users"
import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/lib/api-utils"

// GET /api/users/[id] - Get user by ID
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => getUser(req, { params })

// PATCH /api/users/[id] - Update user
export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => updateUser(req, { params })

// DELETE /api/users/[id] - Delete user
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => deleteUser(req, { params })
