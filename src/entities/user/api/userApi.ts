import { baseApi } from '@/shared/api';
import type { CreateUserDto, UpdateUserDto, User } from '../model/types';

/**
 * API для работы с пользователями
 */
export const userApi = {
  /**
   * Получить текущего пользователя
   */
  async getCurrentUser(): Promise<User> {
    return baseApi.get<User>('/users/me');
  },

  /**
   * Получить пользователя по ID
   */
  async getUserById(id: string): Promise<User> {
    return baseApi.get<User>(`/users/${id}`);
  },

  /**
   * Получить список пользователей
   */
  async getUsers(params?: { limit?: number, offset?: number }): Promise<{ items: User[], total: number }> {
    return baseApi.get<{ items: User[], total: number }>('/users', { 
      params: params as Record<string, string> 
    });
  },

  /**
   * Создать пользователя
   */
  async createUser(data: CreateUserDto): Promise<User> {
    return baseApi.post<User>('/users', data);
  },

  /**
   * Обновить пользователя
   */
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    return baseApi.put<User>(`/users/${id}`, data);
  },

  /**
   * Обновить аватар пользователя
   */
  async updateUserAvatar(id: string, file: File): Promise<{ avatar_url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    return baseApi.post<{ avatar_url: string }>(`/users/${id}/avatar`, formData, {
      headers: {
        // Не указываем Content-Type, он будет автоматически задан браузером для FormData
      },
    });
  },

  /**
   * Удалить пользователя
   */
  async deleteUser(id: string): Promise<void> {
    return baseApi.delete<void>(`/users/${id}`);
  },
}; 