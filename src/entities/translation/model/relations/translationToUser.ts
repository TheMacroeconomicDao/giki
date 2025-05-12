import type { Translation } from '../types';
import type { User } from '@/entities/user';

/**
 * Связь между переводом и пользователем (автором)
 */
export interface TranslationWithAuthor extends Translation {
  author: User;
}

/**
 * Связывает перевод с пользователем
 */
export function attachAuthorToTranslation(translation: Translation, users: User[]): TranslationWithAuthor | null {
  const author = users.find(user => user.id === translation.created_by);
  
  if (!author) {
    return null;
  }
  
  return {
    ...translation,
    author,
  };
}

/**
 * Связывает массив переводов с пользователями
 */
export function attachAuthorsToTranslations(translations: Translation[], users: User[]): TranslationWithAuthor[] {
  return translations
    .map(translation => attachAuthorToTranslation(translation, users))
    .filter((translation): translation is TranslationWithAuthor => translation !== null);
} 