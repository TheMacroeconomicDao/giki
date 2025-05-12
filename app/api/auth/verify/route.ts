import { NextRequest } from "next/server"
import { verify } from "@/src/api/auth"

export const POST = async (req: NextRequest) => verify(req)
