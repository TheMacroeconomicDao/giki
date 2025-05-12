import { baseApi } from '@/shared/api';
import type {
  Version,
  VersionWithAuthor,
  VersionDiffResult,
  CreateVersionDto,
  CompareVersionsParams
} from '../model/types';

/**
 * API для работы с версиями страниц
 */
export const versionApi = {
  /**
   * Получение списка версий для страницы
   */
  async getVersionsByPageId(pageId: string): Promise<VersionWithAuthor[]> {
    return baseApi.get<VersionWithAuthor[]>(`/api/pages/${pageId}/versions`);
  },

  /**
   * Получение конкретной версии страницы
   */
  async getVersionById(versionId: string): Promise<VersionWithAuthor> {
    return baseApi.get<VersionWithAuthor>(`/api/versions/${versionId}`);
  },

  /**
   * Создание новой версии страницы
   */
  async createVersion(data: CreateVersionDto): Promise<Version> {
    return baseApi.post<Version>('/api/versions', data);
  },

  /**
   * Восстановление страницы до указанной версии
   */
  async restoreVersion(versionId: string, userId: string): Promise<{ success: boolean }> {
    return baseApi.post<{ success: boolean }>(`/api/versions/${versionId}/restore`, { userId });
  },

  /**
   * Получение различий между двумя версиями
   */
  async compareVersions(params: CompareVersionsParams): Promise<VersionDiffResult> {
    const { previousVersionId, currentVersionId } = params;
    
    return baseApi.get<VersionDiffResult>(
      `/api/versions/compare`,
      { params: { previousVersionId, currentVersionId } }
    );
  },

  /**
   * Добавление комментария к версии
   */
  async addVersionComment(versionId: string, comment: string, userId: string): Promise<Version> {
    return baseApi.put<Version>(`/api/versions/${versionId}/comment`, { comment, userId });
  },
}; 