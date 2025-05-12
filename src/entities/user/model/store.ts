import { createStore } from '@/shared/lib/zustand/createStore';
import type { User } from './types';

/**
 * Интерфейс состояния пользователя
 */
interface UserState {
  // Текущий пользователь
  currentUser: User | null;
  // Состояние загрузки
  loading: boolean;
  // Ошибка
  error: string | null;

  // Действия
  setCurrentUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Стор для работы с пользователями
 */
export const useUserStore = createStore<UserState>((set) => ({
  // Начальное состояние
  currentUser: null,
  loading: false,
  error: null,
  
  // Действия
  setCurrentUser: (user) => set((state) => {
    state.currentUser = user;
    return state;
  }),

  setLoading: (loading) => set((state) => {
    state.loading = loading;
    return state;
  }),

  setError: (error) => set((state) => {
    state.error = error;
    return state;
  }),
}), 'user-store'); 