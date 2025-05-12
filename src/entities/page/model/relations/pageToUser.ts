import type { Page } from '../types';
import type { User } from '@/entities/user';

/**
 * Связь между страницей и пользователем (автором)
 */
export interface PageWithAuthor extends Page {
  author: User;
}

/**
 * Связывает страницу с пользователем
 */
export function attachAuthorToPage(page: Page, users: User[]): PageWithAuthor | null {
  const author = users.find(user => user.id === page.created_by);
  
  if (!author) {
    return null;
  }
  
  return {
    ...page,
    author,
  };
}

/**
 * Связывает массив страниц с пользователями
 */
export function attachAuthorsToPages(pages: Page[], users: User[]): PageWithAuthor[] {
  return pages
    .map(page => attachAuthorToPage(page, users))
    .filter((page): page is PageWithAuthor => page !== null);
} 