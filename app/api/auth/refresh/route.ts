import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJWT, type JWTPayload, createAccessToken, getSecureCookieOptions } from "@/shared/lib/jwt"
import { logger } from "@/shared/lib/logger"
import { NextRequest } from "next/server"
import { refreshTokenHandler } from "@/src/api/auth"

// Добавляем обработку GET-запросов для редиректов
export async function GET(req: Request) {
  try {
    // Получаем URL параметры
    const url = new URL(req.url)
    const redirectTo = url.searchParams.get('redirect')
    
    // Обрабатываем токен как в POST запросе
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("refresh_token")?.value

    if (!refreshToken) {
      // Если нет токена, перенаправляем на главную с сообщением об ошибке
      return NextResponse.redirect(new URL("/?login=required", req.url))
    }

    try {
      // Проверяем refresh token
      const payload = await verifyJWT<JWTPayload>(refreshToken)

      if (payload.type !== "refresh") {
        throw new Error("Invalid token type")
      }

      // Создаем новый access token
      const accessToken = await createAccessToken({
        sub: payload.sub,
        address: payload.address,
        role: payload.role,
      })

      // Создаем ответ с редиректом
      const response = redirectTo && typeof redirectTo === 'string' && redirectTo.startsWith('/')
        ? NextResponse.redirect(new URL(redirectTo, req.url))
        : NextResponse.redirect(new URL("/", req.url))

      // Устанавливаем токен в куки ответа
      response.cookies.set(
        "access_token",
        accessToken,
        getSecureCookieOptions(15 * 60) // 15 минут
      )

      return response
    } catch (error) {
      logger.error(`Refresh token verification error: ${error instanceof Error ? error.message : String(error)}`)
      
      // Очищаем куки при ошибке
      const response = NextResponse.redirect(new URL("/?login=expired", req.url))
      response.cookies.delete("refresh_token")
      response.cookies.delete("access_token")
      
      return response
    }
  } catch (error) {
    logger.error(`Refresh token GET error: ${error instanceof Error ? error.message : String(error)}`)
    return NextResponse.redirect(new URL("/?error=refresh_failed", req.url))
  }
}

export const POST = async (req: NextRequest) => refreshTokenHandler(req)
