import { baseApi } from '@/shared/api';
import type { TranslatedContent } from '@/entities/translation/model/types';

/**
 * API для работы с переводами страниц
 */
export const translationApi = {
  /**
   * Перевод страницы
   */
  async translatePage(
    pageId: string, 
    content: string, 
    targetLanguage: string
  ): Promise<TranslatedContent> {
    return baseApi.post<TranslatedContent>('/api/translate', {
      pageId,
      content,
      language: targetLanguage
    });
  },

  /**
   * Получение списка доступных языков для перевода
   */
  async getAvailableLanguages(): Promise<{ code: string; name: string }[]> {
    return baseApi.get<{ code: string; name: string }[]>('/api/translate/languages');
  }
};
