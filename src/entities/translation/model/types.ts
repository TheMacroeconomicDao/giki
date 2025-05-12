import { z } from 'zod';

/**
 * Схема валидации для перевода
 */
export const translationSchema = z.object({
  id: z.string().uuid(),
  page_id: z.string().uuid(),
  language: z.string().min(2).max(5),
  title: z.string().min(1),
  content: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid(),
  is_machine_translation: z.boolean().default(false),
});

/**
 * Тип перевода страницы
 */
export type Translation = z.infer<typeof translationSchema>;

/**
 * Тип перевода с информацией об авторе и странице
 */
export interface TranslationWithDetails extends Translation {
  author: {
    id: string;
    name: string | null;
    address: string;
  };
  page: {
    id: string;
    title: string;
  };
}

/**
 * Схема для создания перевода
 */
export const createTranslationSchema = z.object({
  page_id: z.string().uuid(),
  language: z.string().min(2).max(5),
  title: z.string().min(1),
  content: z.string(),
  created_by: z.string().uuid(),
  is_machine_translation: z.boolean().optional(),
});

/**
 * Тип для создания перевода
 */
export type CreateTranslationDto = z.infer<typeof createTranslationSchema>;

/**
 * Схема для обновления перевода
 */
export const updateTranslationSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  is_machine_translation: z.boolean().optional(),
});

/**
 * Тип для обновления перевода
 */
export type UpdateTranslationDto = z.infer<typeof updateTranslationSchema>;

/**
 * Тип для информации о доступных языках перевода
 */
export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  available: boolean;
  percent?: number;
}

/**
 * Тип для статуса перевода
 */
export type TranslationStatus = 'complete' | 'partial' | 'machine' | 'none'; 