import type { NextRequest } from "next/server"
import { getPage, updatePage, deletePage } from "@/src/api/pages"

// GET /api/pages/[id] - Get page by ID
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => getPage(req, { params })

// PATCH /api/pages/[id] - Update page
export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => updatePage(req, { params })

// DELETE /api/pages/[id] - Delete page
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => deletePage(req, { params })
