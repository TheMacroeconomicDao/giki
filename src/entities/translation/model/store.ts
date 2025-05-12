import { createStore } from '@/shared/lib/zustand/createStore';
import type { Translation, TranslationWithDetails, LanguageInfo } from './types';

/**
 * Интерфейс состояния стора переводов
 */
interface TranslationState {
  // Текущий выбранный перевод
  currentTranslation: TranslationWithDetails | null;
  // Список всех переводов для текущей страницы
  translationsList: TranslationWithDetails[];
  // Список доступных языков
  availableLanguages: LanguageInfo[];
  // Текущий выбранный язык
  currentLanguage: string | null;
  // Флаг загрузки
  loading: boolean;
  // Ошибка
  error: string | null;
  
  // Действия
  setCurrentTranslation: (translation: TranslationWithDetails | null) => void;
  setTranslationsList: (translations: TranslationWithDetails[]) => void;
  setAvailableLanguages: (languages: LanguageInfo[]) => void;
  setCurrentLanguage: (languageCode: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Вспомогательные методы
  addTranslation: (translation: TranslationWithDetails) => void;
  updateTranslation: (updatedTranslation: Partial<Translation> & { id: string }) => void;
  removeTranslation: (translationId: string) => void;
  reset: () => void;
}

/**
 * Стор для управления состоянием переводов
 */
export const useTranslationStore = createStore<TranslationState>((set) => ({
  // Начальное состояние
  currentTranslation: null,
  translationsList: [],
  availableLanguages: [],
  currentLanguage: null,
  loading: false,
  error: null,
  
  // Действия
  setCurrentTranslation: (translation) => set((state) => {
    state.currentTranslation = translation;
    return state;
  }),
  
  setTranslationsList: (translations) => set((state) => {
    state.translationsList = translations;
    return state;
  }),
  
  setAvailableLanguages: (languages) => set((state) => {
    state.availableLanguages = languages;
    return state;
  }),
  
  setCurrentLanguage: (languageCode) => set((state) => {
    state.currentLanguage = languageCode;
    
    // Если установлен язык, обновляем и текущий перевод
    if (languageCode) {
      state.currentTranslation = state.translationsList.find(
        t => t.language === languageCode
      ) || null;
    } else {
      state.currentTranslation = null;
    }
    
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
  
  // Добавление перевода в список
  addTranslation: (translation) => set((state) => {
    // Проверяем, есть ли уже такой перевод
    const existingIndex = state.translationsList.findIndex(
      t => t.id === translation.id || (t.page_id === translation.page_id && t.language === translation.language)
    );
    
    // Если перевод существует, заменяем его
    if (existingIndex !== -1) {
      state.translationsList[existingIndex] = translation;
    } else {
      // Иначе добавляем новый
      state.translationsList.push(translation);
    }
    
    // Если это текущий язык, обновляем и текущий перевод
    if (state.currentLanguage === translation.language) {
      state.currentTranslation = translation;
    }
    
    return state;
  }),
  
  // Обновление перевода
  updateTranslation: (updatedTranslation) => set((state) => {
    state.translationsList = state.translationsList.map(translation => 
      translation.id === updatedTranslation.id 
        ? { ...translation, ...updatedTranslation } 
        : translation
    );
    
    // Обновляем текущий перевод, если это он
    if (state.currentTranslation && state.currentTranslation.id === updatedTranslation.id) {
      state.currentTranslation = {
        ...state.currentTranslation,
        ...updatedTranslation
      };
    }
    
    return state;
  }),
  
  // Удаление перевода
  removeTranslation: (translationId) => set((state) => {
    state.translationsList = state.translationsList.filter(
      translation => translation.id !== translationId
    );
    
    // Если удаляем текущий перевод, сбрасываем его
    if (state.currentTranslation && state.currentTranslation.id === translationId) {
      state.currentTranslation = null;
      state.currentLanguage = null;
    }
    
    return state;
  }),
  
  // Сброс состояния
  reset: () => set((state) => {
    state.currentTranslation = null;
    state.translationsList = [];
    state.availableLanguages = [];
    state.currentLanguage = null;
    state.loading = false;
    state.error = null;
    return state;
  }),
}), 'translation-store'); 