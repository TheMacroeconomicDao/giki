import { User } from '@/entities/user';

/**
 * Параметры компонента страницы профиля пользователя
 */
export interface UserProfileProps {
  userId?: string; // ID пользователя, если не указан - текущий пользователь
}

/**
 * Состояние компонента страницы профиля пользователя
 */
export interface UserProfileState {
  loading: boolean;
  error: string | null;
  user: User | null;
  isCurrentUser: boolean;
  isFollowing: boolean;
}

/**
 * Статистика пользователя
 */
export interface UserStats {
  pagesCreated: number;
  pagesEdited: number;
  followers: number;
  following: number;
  reputation: number;
} 