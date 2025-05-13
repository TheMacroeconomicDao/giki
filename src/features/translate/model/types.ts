import type { TranslatedContent } from '@/entities/translation/model/types';

/**
 * Параметры запроса перевода
 */
export interface TranslateParams {
  pageId: string;
  content: string;
  targetLanguage: string;
}

/**
 * Состояние процесса перевода
 */
export interface TranslationState {
  isLoading: boolean;
  error: string | null;
  translations: Record<string, TranslatedContent>;
}

/**
 * Доступный язык для перевода
 */
export interface AvailableLanguage {
  code: string;
  name: string;
  nativeName?: string;
}
