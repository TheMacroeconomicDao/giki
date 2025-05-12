import { baseApi } from '@/shared/api';
import type {
  Page,
  CreatePageDto,
  UpdatePageDto,
  PageWithAuthor,
  PageWithDetails,
  PageVersion,
  TranslatedContent,
  CreateTranslationDto
} from '../model/types';

/**
 * API для работы со страницами
 */
export const pageApi = {
  /**
   * Создание новой страницы
   */
  async createPage(data: CreatePageDto): Promise<Page> {
    return baseApi.post<Page>('/api/pages', data);
  },

  /**
   * Получение страницы по ID
   */
  async getPageById(id: string): Promise<PageWithDetails> {
    return baseApi.get<PageWithDetails>(`/api/pages/${id}`);
  },

  /**
   * Обновление страницы
   */
  async updatePage(id: string, data: UpdatePageDto, userId: string): Promise<Page> {
    return baseApi.put<Page>(`/api/pages/${id}`, { ...data, userId });
  },

  /**
   * Удаление страницы
   */
  async deletePage(id: string): Promise<{ success: boolean }> {
    return baseApi.delete<{ success: boolean }>(`/api/pages/${id}`);
  },

  /**
   * Список страниц с фильтрацией
   */
  async listPages(params?: {
    visibility?: string;
    author_id?: string;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<{ pages: PageWithAuthor[]; total: number }> {
    return baseApi.get<{ pages: PageWithAuthor[]; total: number }>('/api/pages', { params });
  },

  /**
   * Увеличение счетчика просмотров
   */
  async incrementPageViews(id: string): Promise<{ success: boolean }> {
    return baseApi.post<{ success: boolean }>(`/api/pages/${id}/views`);
  },

  /**
   * Получение версий страницы
   */
  async getPageVersions(pageId: string): Promise<PageVersion[]> {
    return baseApi.get<PageVersion[]>(`/api/pages/${pageId}/versions`);
  },

  /**
   * Получение конкретной версии страницы
   */
  async getPageVersion(versionId: string): Promise<PageVersion> {
    return baseApi.get<PageVersion>(`/api/versions/${versionId}`);
  },

  /**
   * Добавление перевода для страницы
   */
  async addTranslation(data: CreateTranslationDto): Promise<TranslatedContent> {
    return baseApi.post<TranslatedContent>('/api/translations', data);
  },

  /**
   * Получение перевода страницы на определенный язык
   */
  async getTranslation(pageId: string, language: string): Promise<TranslatedContent> {
    return baseApi.get<TranslatedContent>(`/api/pages/${pageId}/translations/${language}`);
  },

  /**
   * Получение всех переводов для страницы
   */
  async getPageTranslations(pageId: string): Promise<TranslatedContent[]> {
    return baseApi.get<TranslatedContent[]>(`/api/pages/${pageId}/translations`);
  },
}; 