import { createStore } from '@/shared/lib/zustand/createStore';
import type { User } from '@/entities/user';
import type { AuthStatus, Web3Provider } from './types';

/**
 * Интерфейс состояния аутентификации
 */
interface AuthState {
  // Статус аутентификации
  status: AuthStatus;
  // Текущий пользователь
  user: User | null;
  // Текущий Web3 провайдер
  web3Provider: Web3Provider;
  // Адрес кошелька
  walletAddress: string | null;
  // Состояние загрузки
  loading: boolean;
  // Ошибка
  error: string | null;

  // Действия
  setStatus: (status: AuthStatus) => void;
  setUser: (user: User | null) => void;
  setWeb3Provider: (provider: Web3Provider) => void;
  setWalletAddress: (address: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

/**
 * Стор для работы с аутентификацией
 */
export const useAuthStore = createStore<AuthState>((set) => ({
  // Начальное состояние
  status: 'unauthenticated',
  user: null,
  web3Provider: null,
  walletAddress: null,
  loading: false,
  error: null,
  
  // Действия
  setStatus: (status) => set((state) => {
    state.status = status;
    return state;
  }),

  setUser: (user) => set((state) => {
    state.user = user;
    return state;
  }),

  setWeb3Provider: (provider) => set((state) => {
    state.web3Provider = provider;
    return state;
  }),

  setWalletAddress: (address) => set((state) => {
    state.walletAddress = address;
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

  reset: () => set((state) => {
    state.status = 'unauthenticated';
    state.user = null;
    state.web3Provider = null;
    state.walletAddress = null;
    state.error = null;
    return state;
  }),
}), 'auth-store'); 