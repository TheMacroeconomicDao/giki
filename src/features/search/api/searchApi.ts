import { baseApi } from '@/shared/api';
import type { SearchResult, SearchParams } from '../model/types';

/**
 * API для поиска
 */
export const searchApi = {
  /**
   * Основной поиск
   */
  async search(query: string, params?: Omit<SearchParams, 'query'>): Promise<SearchResult[]> {
    return baseApi.get<SearchResult[]>('/api/search', {
      params: {
        q: query,
        ...params
      }
    });
  },

  /**
   * Получение автодополнений для поиска
   */
  async getSearchSuggestions(query: string): Promise<SearchResult[]> {
    return baseApi.get<SearchResult[]>('/api/search/suggestions', {
      params: { q: query }
    });
  }
};
