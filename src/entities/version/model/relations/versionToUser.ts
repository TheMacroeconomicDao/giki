import type { Version } from '../types';
import type { User } from '@/entities/user';

/**
 * Связь между версией и пользователем (автором)
 */
export interface VersionWithAuthor extends Version {
  author: User;
}

/**
 * Связывает версию с пользователем
 */
export function attachAuthorToVersion(version: Version, users: User[]): VersionWithAuthor | null {
  const author = users.find(user => user.id === version.created_by);
  
  if (!author) {
    return null;
  }
  
  return {
    ...version,
    author,
  };
}

/**
 * Связывает массив версий с пользователями
 */
export function attachAuthorsToVersions(versions: Version[], users: User[]): VersionWithAuthor[] {
  return versions
    .map(version => attachAuthorToVersion(version, users))
    .filter((version): version is VersionWithAuthor => version !== null);
} 