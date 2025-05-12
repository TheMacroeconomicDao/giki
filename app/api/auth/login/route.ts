import { NextRequest } from "next/server"
import { login } from "@/src/api/auth"

export const POST = async (req: NextRequest) => login(req)
