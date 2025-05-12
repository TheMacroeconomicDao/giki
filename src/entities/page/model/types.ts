import { z } from 'zod';

/**
 * Схема валидации для страницы
 */
export const pageSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  content: z.string(),
  visibility: z.enum(['public', 'community', 'private']),
  author_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  views: z.number().int().nonnegative(),
});

/**
 * Тип страницы
 */
export type Page = z.infer<typeof pageSchema>;

/**
 * Схема валидации для версии страницы
 */
export const pageVersionSchema = z.object({
  id: z.string().uuid(),
  page_id: z.string().uuid(),
  content: z.string(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid(),
});

/**
 * Тип версии страницы
 */
export type PageVersion = z.infer<typeof pageVersionSchema>;

/**
 * Схема валидации для переведенного контента
 */
export const translatedContentSchema = z.object({
  id: z.string().uuid(),
  page_id: z.string().uuid(),
  language: z.string().min(2).max(5),
  content: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

/**
 * Тип переведенного контента
 */
export type TranslatedContent = z.infer<typeof translatedContentSchema>;

/**
 * Тип страницы с информацией об авторе
 */
export interface PageWithAuthor extends Page {
  author: {
    id: string;
    name: string | null;
    address: string;
  };
}

/**
 * Тип страницы с дополнительными деталями
 */
export interface PageWithDetails extends PageWithAuthor {
  translations: string[];
  version_count: number;
}

/**
 * Схема для создания страницы
 */
export const createPageSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  visibility: z.enum(['public', 'community', 'private']),
  author_id: z.string().uuid(),
});

/**
 * Тип для создания страницы
 */
export type CreatePageDto = z.infer<typeof createPageSchema>;

/**
 * Схема для обновления страницы
 */
export const updatePageSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  visibility: z.enum(['public', 'community', 'private']).optional(),
});

/**
 * Тип для обновления страницы
 */
export type UpdatePageDto = z.infer<typeof updatePageSchema>;

/**
 * Схема для создания перевода
 */
export const createTranslationSchema = z.object({
  page_id: z.string().uuid(),
  language: z.string().min(2).max(5),
  content: z.string(),
});

/**
 * Тип для создания перевода
 */
export type CreateTranslationDto = z.infer<typeof createTranslationSchema>; 