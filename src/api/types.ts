/**
 * Общие типы для API (FSD)
 */
import { NextRequest } from 'next/server';

/**
 * Стандартный тип для ответа API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

/**
 * Тип для обработчика API роутов
 */
export type ApiHandler<T = any> = (
  req: NextRequest,
  params: { [key: string]: string }
) => Promise<ApiResponse<T>>;

/**
 * Типы HTTP методов
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Опции для API роутов
 */
export interface ApiRouteOptions {
  requireAuth?: boolean;
  requiredRoles?: string[];
}

/**
 * Результат аутентификации
 */
export interface AuthResult {
  authenticated: boolean;
  user?: {
    id: string;
    role: string;
    sub: string;
    [key: string]: any;
  };
} 