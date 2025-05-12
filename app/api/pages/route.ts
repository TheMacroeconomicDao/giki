import { NextRequest } from "next/server"
import { getPages, createPage } from "@/src/api/pages"
import { logger } from "@/shared/lib/logger"
import { successResponse, errorResponse, handleApiError, authenticateRequest } from "@/src/api/utils"

export const GET = async (req: NextRequest) => getPages(req)

// POST /api/pages - Create a new page
export const POST = async (req: NextRequest) => createPage(req)
