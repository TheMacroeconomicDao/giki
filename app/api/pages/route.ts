import { NextRequest } from "next/server"
import { getPages, createPage } from "@/api/pages"
import { logger } from "@/shared/lib/logger"
import { successResponse, errorResponse, handleApiError, authenticateRequest } from "@/api/utils"

export const GET = async (req: NextRequest) => getPages(req)

// POST /api/pages - Create a new page
export const POST = async (req: NextRequest) => createPage(req)
