/**
 * Типы для API аутентификации (FSD)
 */

/**
 * Данные для аутентификации
 */
export interface AuthSignatureData {
  address: string;
  signature: string;
  message: string;
}

/**
 * Данные для проверки токена
 */
export interface VerifyTokenData {
  token: string;
}

/**
 * Данные о текущем пользователе
 */
export interface CurrentUserData {
  id: string;
  address: string;
  name: string | null;
  email: string | null;
  role: string;
  lastLogin: string | null;
  preferences: {
    language: string;
    theme: string;
    emailNotifications: boolean;
    [key: string]: any;
  };
}

/**
 * Ответ API аутентификации
 */
export interface AuthResponse {
  user: CurrentUserData;
  token: string;
  refreshToken?: string;
  expiresAt: number;
}

/**
 * Ответ API на запрос текущего пользователя
 */
export interface MeResponse {
  user: CurrentUserData;
}

/**
 * Данные для обновления токена
 */
export interface RefreshTokenData {
  refreshToken: string;
} 