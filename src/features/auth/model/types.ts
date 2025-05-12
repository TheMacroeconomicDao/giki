import { z } from 'zod';

/**
 * Доступные Web3 провайдеры
 */
export type Web3Provider = 'metamask' | 'walletconnect' | 'coinbase' | null;

/**
 * Схема запроса на аутентификацию
 */
export const authRequestSchema = z.object({
  address: z.string(),
  signature: z.string(),
  message: z.string(),
});

/**
 * Тип запроса на аутентификацию
 */
export type AuthRequest = z.infer<typeof authRequestSchema>;

/**
 * Тип ответа на аутентификацию
 */
export interface AuthResponse {
  user: {
    id: string;
    address: string;
    role: string;
    name: string | null;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * Статус аутентификации
 */
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading'; 