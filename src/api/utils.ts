/**
 * Утилиты для API (FSD)
 */
import { NextResponse } from 'next/server';
import { ApiResponse } from './types';
import { cookies } from 'next/headers';
import { verifyToken } from '@/shared/lib/jwt';

/**
 * Возвращает успешный ответ API
 */
export function successResponse<T>(data: T, status = 200): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    status,
  };
  
  return NextResponse.json(response, { status });
}

/**
 * Возвращает ответ с ошибкой
 */
export function errorResponse(error: string, status = 500): NextResponse {
  const response: ApiResponse = {
    success: false,
    error,
    status,
  };
  
  return NextResponse.json(response, { status });
}

/**
 * Обрабатывает ошибки API
 */
export function handleApiError(error: unknown, defaultMessage = 'Произошла ошибка'): NextResponse {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    return errorResponse(error.message);
  }
  
  return errorResponse(defaultMessage);
}

/**
 * Аутентифицирует запрос по JWT токену
 */
export async function authenticateRequest(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return { authenticated: false };
    }
    
    const decoded = await verifyToken(token);
    return { 
      authenticated: true, 
      user: decoded 
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false };
  }
} 