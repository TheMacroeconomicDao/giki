import type { Version } from '../types';
import type { Page } from '@/entities/page';

/**
 * Связь между версией и страницей
 */
export interface VersionWithPage extends Version {
  page: Page;
}

/**
 * Связывает версию с страницей
 */
export function attachPageToVersion(version: Version, pages: Page[]): VersionWithPage | null {
  const page = pages.find(page => page.id === version.page_id);
  
  if (!page) {
    return null;
  }
  
  return {
    ...version,
    page,
  };
}

/**
 * Связывает массив версий с страницами
 */
export function attachPagesToVersions(versions: Version[], pages: Page[]): VersionWithPage[] {
  return versions
    .map(version => attachPageToVersion(version, pages))
    .filter((version): version is VersionWithPage => version !== null);
} 