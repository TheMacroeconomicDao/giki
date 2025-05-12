import { createStore } from '@/shared/lib/zustand/createStore';
import type { UserSettings, SystemSettings, UpdateUserSettingsDto, UpdateSystemSettingsDto } from './types';

/**
 * Интерфейс состояния стора настроек
 */
interface SettingsState {
  // Пользовательские настройки
  userSettings: UserSettings | null;
  // Системные настройки
  systemSettings: SystemSettings | null;
  // Флаг загрузки
  loading: boolean;
  // Ошибка
  error: string | null;
  
  // Действия для пользовательских настроек
  setUserSettings: (settings: UserSettings | null) => void;
  updateUserSettings: (updates: UpdateUserSettingsDto) => void;
  
  // Действия для системных настроек
  setSystemSettings: (settings: SystemSettings | null) => void;
  updateSystemSettings: (updates: UpdateSystemSettingsDto) => void;
  
  // Общие действия
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

/**
 * Стор для управления состоянием настроек
 */
export const useSettingsStore = createStore<SettingsState>((set) => ({
  // Начальное состояние
  userSettings: null,
  systemSettings: null,
  loading: false,
  error: null,
  
  // Действия для пользовательских настроек
  setUserSettings: (settings) => set((state) => {
    state.userSettings = settings;
    return state;
  }),
  
  updateUserSettings: (updates) => set((state) => {
    if (state.userSettings) {
      state.userSettings = {
        ...state.userSettings,
        ...updates,
        updated_at: new Date().toISOString()
      };
    }
    return state;
  }),
  
  // Действия для системных настроек
  setSystemSettings: (settings) => set((state) => {
    state.systemSettings = settings;
    return state;
  }),
  
  updateSystemSettings: (updates) => set((state) => {
    if (state.systemSettings) {
      state.systemSettings = {
        ...state.systemSettings,
        ...updates,
        updated_at: new Date().toISOString()
      };
    }
    return state;
  }),
  
  // Общие действия
  setLoading: (loading) => set((state) => {
    state.loading = loading;
    return state;
  }),
  
  setError: (error) => set((state) => {
    state.error = error;
    return state;
  }),
  
  clearError: () => set((state) => {
    state.error = null;
    return state;
  }),
  
  reset: () => set((state) => {
    state.userSettings = null;
    state.systemSettings = null;
    state.loading = false;
    state.error = null;
    return state;
  }),
}), 'settings-store'); 