import { createStore } from '@/shared/lib/zustand/createStore';
import type { Version, VersionWithAuthor, VersionDiffResult } from './types';

/**
 * Интерфейс состояния стора версий
 */
interface VersionState {
  // Текущая выбранная версия
  currentVersion: VersionWithAuthor | null;
  // Список версий для страницы
  versionsList: VersionWithAuthor[];
  // Результат сравнения версий
  diffResult: VersionDiffResult | null;
  // Флаг загрузки
  loading: boolean;
  // Ошибка
  error: string | null;
  
  // Действия
  setCurrentVersion: (version: VersionWithAuthor | null) => void;
  setVersionsList: (versions: VersionWithAuthor[]) => void;
  setDiffResult: (diffResult: VersionDiffResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Вспомогательные методы
  addVersionToList: (version: VersionWithAuthor) => void;
  reset: () => void;
}

/**
 * Стор для управления состоянием версий страниц
 */
export const useVersionStore = createStore<VersionState>((set) => ({
  // Начальное состояние
  currentVersion: null,
  versionsList: [],
  diffResult: null,
  loading: false,
  error: null,
  
  // Действия
  setCurrentVersion: (version) => set((state) => {
    state.currentVersion = version;
    return state;
  }),
  
  setVersionsList: (versions) => set((state) => {
    state.versionsList = versions;
    return state;
  }),
  
  setDiffResult: (diffResult) => set((state) => {
    state.diffResult = diffResult;
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
  
  clearError: () => set((state) => {
    state.error = null;
    return state;
  }),
  
  // Добавление версии в список
  addVersionToList: (version) => set((state) => {
    // Проверяем, нет ли уже такой версии
    const exists = state.versionsList.some(v => v.id === version.id);
    
    // Если версии нет, добавляем в начало списка и сортируем по номеру версии
    if (!exists) {
      state.versionsList = [...state.versionsList, version]
        .sort((a, b) => b.version_number - a.version_number);
    }
    
    return state;
  }),
  
  // Сброс состояния
  reset: () => set((state) => {
    state.currentVersion = null;
    state.versionsList = [];
    state.diffResult = null;
    state.loading = false;
    state.error = null;
    return state;
  }),
}), 'version-store'); 