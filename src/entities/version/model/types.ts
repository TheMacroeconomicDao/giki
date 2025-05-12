import { z } from 'zod';

/**
 * Схема валидации для версии страницы
 */
export const versionSchema = z.object({
  id: z.string().uuid(),
  page_id: z.string().uuid(),
  content: z.string(),
  title: z.string().min(1),
  created_at: z.string().datetime(),
  created_by: z.string().uuid(),
  comment: z.string().optional(),
  version_number: z.number().int().positive(),
});

/**
 * Тип версии страницы
 */
export type Version = z.infer<typeof versionSchema>;

/**
 * Тип версии страницы с информацией об авторе
 */
export interface VersionWithAuthor extends Version {
  author: {
    id: string;
    name: string | null;
    address: string;
  };
}

/**
 * Схема для создания версии страницы
 */
export const createVersionSchema = z.object({
  page_id: z.string().uuid(),
  content: z.string(),
  title: z.string().min(1),
  created_by: z.string().uuid(),
  comment: z.string().optional(),
});

/**
 * Тип для создания версии страницы
 */
export type CreateVersionDto = z.infer<typeof createVersionSchema>;

/**
 * Тип для различий между версиями
 */
export interface VersionDiffResult {
  previous: Version | null;
  current: Version;
  diffs: {
    content: VersionDiffItem[];
    title: VersionDiffItem[];
  };
}

/**
 * Тип для элемента различий между версиями
 */
export interface VersionDiffItem {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
}

/**
 * Тип для сравнения двух версий
 */
export interface CompareVersionsParams {
  previousVersionId?: string;
  currentVersionId: string;
} 