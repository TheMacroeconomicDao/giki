import type { Translation } from '../types';
import type { Page } from '@/entities/page';

/**
 * Связь между переводом и страницей
 */
export interface TranslationWithPage extends Translation {
  page: Page;
}

/**
 * Связывает перевод с страницей
 */
export function attachPageToTranslation(translation: Translation, pages: Page[]): TranslationWithPage | null {
  const page = pages.find(page => page.id === translation.page_id);
  
  if (!page) {
    return null;
  }
  
  return {
    ...translation,
    page,
  };
}

/**
 * Связывает массив переводов с страницами
 */
export function attachPagesToTranslations(translations: Translation[], pages: Page[]): TranslationWithPage[] {
  return translations
    .map(translation => attachPageToTranslation(translation, pages))
    .filter((translation): translation is TranslationWithPage => translation !== null);
} 