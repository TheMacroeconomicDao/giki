import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import type { AdminState, AppStats, UserManagementParams, UserRole } from './types';

const initialState: AdminState = {
  stats: null,
  isLoading: false,
  error: null,
};

type AdminActions = {
  setStats: (stats: AppStats | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchStats: () => Promise<void>;
  manageUser: (params: UserManagementParams) => Promise<void>;
  reset: () => void;
};

/**
 * Стор для административного модуля
 */
export const useAdminStore = create<AdminState & AdminActions>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // Действия
      setStats: (stats) => set((state) => {
        state.stats = stats;
        return state;
      }),

      setLoading: (isLoading) => set((state) => {
        state.isLoading = isLoading;
        return state;
      }),

      setError: (error) => set((state) => {
        state.error = error;
        return state;
      }),

      // Асинхронные действия
      fetchStats: async () => {
        const { setLoading, setError, setStats } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          // Здесь будет вызов API
          const response = await fetch('/api/admin/stats');
          if (!response.ok) throw new Error('Ошибка загрузки статистики');
          
          const data = await response.json();
          setStats(data);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
        } finally {
          setLoading(false);
        }
      },

      manageUser: async (params) => {
        const { setLoading, setError } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          // Здесь будет вызов API
          const response = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка управления пользователем');
          }
          
          // После успешного действия можно обновить статистику
          get().fetchStats();
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
        } finally {
          setLoading(false);
        }
      },

      reset: () => set(initialState),
    })),
    { name: 'admin-store' }
  )
);
