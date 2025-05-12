import { NextRequest } from "next/server"
import { me } from "@/src/api/auth"

export const GET = async (req: NextRequest) => me(req)
