/**
 * Типы для API пользователей (FSD)
 */
import { User, UserRole } from '@/entities/user';

/**
 * Параметры запроса для получения пользователей
 */
export interface GetUsersParams {
  limit?: number;
  offset?: number;
  role?: UserRole;
  search?: string;
}

/**
 * Данные для создания пользователя
 */
export interface CreateUserData {
  address: string;
  name?: string;
  email?: string;
  role?: UserRole;
  avatarUrl?: string;
}

/**
 * Данные для обновления пользователя
 */
export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  avatarUrl?: string;
}

/**
 * Параметры для API операций над одним пользователем
 */
export interface UserParams {
  id: string;
}

/**
 * Ответ на запрос получения пользователей
 */
export interface GetUsersResponse {
  users: User[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Ответ на запрос получения пользователя
 */
export interface GetUserResponse {
  user: User;
} 