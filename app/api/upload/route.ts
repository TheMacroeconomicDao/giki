import { NextResponse } from "next/server"
import { authenticateRequest, handleApiError, successResponse, errorResponse } from "@/src/api/utils"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { v4 as uuidv4 } from "uuid"
import { logger } from "@/shared/lib/logger"

// POST /api/upload - Upload a file
export async function POST(req: Request) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req)
    if (!auth.authenticated) return auth.error

    // Get form data
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return errorResponse("No file provided")
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return errorResponse("Only image files are allowed")
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return errorResponse("File size exceeds 5MB limit")
    }

    // Get the file extension
    const fileExtension = file.name.split(".").pop() || ""
    
    // Create a unique filename
    const fileName = `${uuidv4()}.${fileExtension}`
    
    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), "public", "uploads")
    
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    // Save the file
    const filePath = join(uploadsDir, fileName)
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, fileBuffer)
    
    // Return the URL
    const fileUrl = `/uploads/${fileName}`
    
    return successResponse({ url: fileUrl })
  } catch (error) {
    logger.error("File upload error:", error as Error)
    return handleApiError(error, "Failed to upload file")
  }
}

// Configure max payload size
export const config = {
  api: {
    bodyParser: false,
  },
} 