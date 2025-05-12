import { baseApi } from '@/shared/api';
import type {
  Translation,
  TranslationWithDetails,
  CreateTranslationDto,
  UpdateTranslationDto,
  LanguageInfo
} from '../model/types';

/**
 * API для работы с переводами страниц
 */
export const translationApi = {
  /**
   * Получение списка всех переводов для страницы
   */
  async getTranslationsByPageId(pageId: string): Promise<TranslationWithDetails[]> {
    return baseApi.get<TranslationWithDetails[]>(`/api/pages/${pageId}/translations`);
  },

  /**
   * Получение конкретного перевода по ID
   */
  async getTranslationById(translationId: string): Promise<TranslationWithDetails> {
    return baseApi.get<TranslationWithDetails>(`/api/translations/${translationId}`);
  },

  /**
   * Получение перевода страницы на определенный язык
   */
  async getTranslationByLanguage(pageId: string, language: string): Promise<TranslationWithDetails> {
    return baseApi.get<TranslationWithDetails>(`/api/pages/${pageId}/translations/${language}`);
  },

  /**
   * Создание нового перевода
   */
  async createTranslation(data: CreateTranslationDto): Promise<Translation> {
    return baseApi.post<Translation>('/api/translations', data);
  },

  /**
   * Обновление существующего перевода
   */
  async updateTranslation(translationId: string, data: UpdateTranslationDto, userId: string): Promise<Translation> {
    return baseApi.put<Translation>(`/api/translations/${translationId}`, { ...data, userId });
  },

  /**
   * Удаление перевода
   */
  async deleteTranslation(translationId: string): Promise<{ success: boolean }> {
    return baseApi.delete<{ success: boolean }>(`/api/translations/${translationId}`);
  },

  /**
   * Получение списка доступных языков для перевода
   */
  async getAvailableLanguages(): Promise<LanguageInfo[]> {
    return baseApi.get<LanguageInfo[]>('/api/translations/languages');
  },

  /**
   * Получение списка языков, на которые переведена страница
   */
  async getPageLanguages(pageId: string): Promise<LanguageInfo[]> {
    return baseApi.get<LanguageInfo[]>(`/api/pages/${pageId}/languages`);
  },

  /**
   * Создание машинного перевода страницы
   */
  async createMachineTranslation(pageId: string, language: string, userId: string): Promise<Translation> {
    return baseApi.post<Translation>('/api/translations/machine', { pageId, language, userId });
  },
}; 