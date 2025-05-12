/**
 * Set secure cookie options
 */
export function getSecureCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  }
}

// Константы для названий кук
export const ACCESS_TOKEN_COOKIE = 'accessToken'
export const REFRESH_TOKEN_COOKIE = 'refreshToken'

// Время жизни кук в секундах
export const ACCESS_TOKEN_COOKIE_MAX_AGE = 15 * 60 // 15 минут
export const REFRESH_TOKEN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 дней 