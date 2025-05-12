/**
 * Типы для API страниц (FSD)
 */
import { Page, PageVisibility } from '@/entities/page';

/**
 * Параметры запроса для получения страниц
 */
export interface GetPagesParams {
  limit?: number;
  offset?: number;
  visibility?: PageVisibility;
  authorId?: string;
  search?: string;
}

/**
 * Данные для создания страницы
 */
export interface CreatePageData {
  title: string;
  content: string;
  visibility: PageVisibility;
  translatedContent?: Record<string, string>;
}

/**
 * Данные для обновления страницы
 */
export interface UpdatePageData {
  title?: string;
  content?: string;
  visibility?: PageVisibility;
  translatedContent?: Record<string, string>;
}

/**
 * Параметры для API операций над одной страницей
 */
export interface PageParams {
  id: string;
}

/**
 * Ответ на запрос получения страниц
 */
export interface GetPagesResponse {
  pages: Page[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Ответ на запрос получения страницы
 */
export interface GetPageResponse {
  page: Page;
} 