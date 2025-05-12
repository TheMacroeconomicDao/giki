import { baseApi } from '@/shared/api';
import type { AuthRequest, AuthResponse } from '../model/types';

/**
 * API для работы с аутентификацией
 */
export const authApi = {
  /**
   * Аутентификация пользователя
   */
  async login(data: AuthRequest): Promise<AuthResponse> {
    return baseApi.post<AuthResponse>('/auth/login', data);
  },

  /**
   * Выход пользователя
   */
  async logout(): Promise<void> {
    return baseApi.post<void>('/auth/logout');
  },

  /**
   * Проверка текущей сессии
   */
  async getSession(): Promise<{ authenticated: boolean }> {
    return baseApi.get<{ authenticated: boolean }>('/auth/session');
  },

  /**
   * Обновление токена доступа
   */
  async refreshToken(): Promise<{ success: boolean }> {
    return baseApi.post<{ success: boolean }>('/auth/refresh');
  }
}; 