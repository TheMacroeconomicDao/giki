import { baseApi } from '@/shared/api';
import type {
  UserSettings,
  SystemSettings,
  UpdateUserSettingsDto,
  UpdateSystemSettingsDto
} from '../model/types';

/**
 * API для работы с настройками
 */
export const settingsApi = {
  /**
   * Получение настроек пользователя
   */
  async getUserSettings(userId: string): Promise<UserSettings> {
    return baseApi.get<UserSettings>(`/api/users/${userId}/settings`);
  },

  /**
   * Обновление настроек пользователя
   */
  async updateUserSettings(userId: string, data: UpdateUserSettingsDto): Promise<UserSettings> {
    return baseApi.put<UserSettings>(`/api/users/${userId}/settings`, data);
  },

  /**
   * Сброс настроек пользователя до значений по умолчанию
   */
  async resetUserSettings(userId: string): Promise<UserSettings> {
    return baseApi.post<UserSettings>(`/api/users/${userId}/settings/reset`, {});
  },

  /**
   * Получение системных настроек
   */
  async getSystemSettings(): Promise<SystemSettings> {
    return baseApi.get<SystemSettings>('/api/settings/system');
  },

  /**
   * Обновление системных настроек (только для админов)
   */
  async updateSystemSettings(data: UpdateSystemSettingsDto, userId: string): Promise<SystemSettings> {
    return baseApi.put<SystemSettings>('/api/settings/system', { ...data, userId });
  },

  /**
   * Получение настроек темы для пользователя
   */
  async getUserTheme(userId: string): Promise<{ theme: 'light' | 'dark' | 'system' }> {
    return baseApi.get<{ theme: 'light' | 'dark' | 'system' }>(`/api/users/${userId}/settings/theme`);
  },
  
  /**
   * Обновление настроек темы для пользователя
   */
  async updateUserTheme(userId: string, theme: 'light' | 'dark' | 'system'): Promise<{ success: boolean }> {
    return baseApi.put<{ success: boolean }>(`/api/users/${userId}/settings/theme`, { theme });
  },

  /**
   * Получение настроек языка для пользователя
   */
  async getUserLanguage(userId: string): Promise<{ language: string }> {
    return baseApi.get<{ language: string }>(`/api/users/${userId}/settings/language`);
  },
  
  /**
   * Обновление настроек языка для пользователя
   */
  async updateUserLanguage(userId: string, language: string): Promise<{ success: boolean }> {
    return baseApi.put<{ success: boolean }>(`/api/users/${userId}/settings/language`, { language });
  },
}; 