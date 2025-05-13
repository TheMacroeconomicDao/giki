/**
 * Типы для административной фичи
 */

/**
 * Роли пользователей
 */
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

/**
 * Интерфейс статистики
 */
export interface AppStats {
  totalUsers: number;
  totalPages: number;
  totalTranslations: number;
  activeUsers: number;
  lastUpdated: string;
}

/**
 * Параметры для операций над пользователями
 */
export interface UserManagementParams {
  userId: string;
  action: 'grant_role' | 'revoke_role' | 'ban' | 'unban' | 'delete';
  role?: UserRole;
}

/**
 * Состояние административной части
 */
export interface AdminState {
  stats: AppStats | null;
  isLoading: boolean;
  error: string | null;
}
