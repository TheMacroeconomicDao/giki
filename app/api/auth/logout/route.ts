import { NextRequest } from "next/server"
import { logout } from "@/src/api/auth"

export const POST = async (req: NextRequest) => logout(req)
