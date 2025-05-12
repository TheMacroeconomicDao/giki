/**
 * Обработчики API для аутентификации (FSD)
 */
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { 
  verifySignature, 
  generateToken, 
  refreshToken as refreshTokenFn,
  verifyToken,
  logout as logoutFn
} from '@/entities/user';
import { authenticateRequest, successResponse, errorResponse, handleApiError } from '../utils';
import { AuthSignatureData, RefreshTokenData } from './types';

/**
 * Аутентификация с помощью подписи Web3
 */
export async function login(req: NextRequest) {
  try {
    const data = await req.json() as AuthSignatureData;
    
    // Валидация данных
    if (!data.address || !data.signature || !data.message) {
      return errorResponse('Address, signature, and message are required', 400);
    }
    
    // Проверка подписи
    const result = await verifySignature(data.address, data.message, data.signature);
    
    if (!result.valid) {
      return errorResponse('Invalid signature', 401);
    }
    
    // Генерация токена
    const { user, token, refreshToken, expiresAt } = await generateToken(data.address);
    
    // Установка cookie
    cookies().set('token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 день
      path: '/',
      sameSite: 'lax'
    });
    
    if (refreshToken) {
      cookies().set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 дней
        path: '/',
        sameSite: 'lax'
      });
    }

    return successResponse({
      user,
      token,
      refreshToken,
      expiresAt
    });
  } catch (error) {
    return handleApiError(error, 'Authentication failed');
  }
}

/**
 * Обновление токена
 */
export async function refreshTokenHandler(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const refreshTokenValue = cookieStore.get('refreshToken')?.value;
    
    if (!refreshTokenValue) {
      const data = await req.json() as RefreshTokenData;
      
      if (!data.refreshToken) {
        return errorResponse('Refresh token is required', 400);
      }
      
      const { user, token, refreshToken, expiresAt } = await refreshTokenFn(data.refreshToken);
      
      // Установка cookie
      cookies().set('token', token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 день
        path: '/',
        sameSite: 'lax'
      });
      
      if (refreshToken) {
        cookies().set('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 7 дней
          path: '/',
          sameSite: 'lax'
        });
      }

      return successResponse({
        user,
        token,
        refreshToken,
        expiresAt
      });
    } else {
      const { user, token, refreshToken, expiresAt } = await refreshTokenFn(refreshTokenValue);
      
      // Установка cookie
      cookies().set('token', token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 день
        path: '/',
        sameSite: 'lax'
      });
      
      if (refreshToken) {
        cookies().set('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 7 дней
          path: '/',
          sameSite: 'lax'
        });
      }

      return successResponse({
        user,
        token,
        refreshToken,
        expiresAt
      });
    }
  } catch (error) {
    return handleApiError(error, 'Failed to refresh token');
  }
}

/**
 * Проверка токена
 */
export async function verify(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return errorResponse('Token is required', 400);
    }
    
    const decoded = await verifyToken(token);
    
    return successResponse({
      valid: true,
      user: decoded
    });
  } catch (error) {
    return handleApiError(error, 'Token verification failed');
  }
}

/**
 * Информация о текущем пользователе
 */
export async function me(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    
    if (!auth.authenticated) {
      return errorResponse('Not authenticated', 401);
    }
    
    return successResponse({
      user: auth.user
    });
  } catch (error) {
    return handleApiError(error, 'Failed to get user info');
  }
}

/**
 * Выход из системы
 */
export async function logout(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (token) {
      await logoutFn(token);
    }
    
    // Удаление cookie
    cookies().set('token', '', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
      sameSite: 'lax'
    });
    
    cookies().set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
      sameSite: 'lax'
    });
    
    return successResponse({
      success: true
    });
  } catch (error) {
    return handleApiError(error, 'Logout failed');
  }
} 