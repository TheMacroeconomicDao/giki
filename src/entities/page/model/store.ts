import { createStore } from '@/shared/lib/store/createStore';
import type { Page, PageWithAuthor, PageWithDetails } from './types';

/**
 * Интерфейс состояния стора страниц
 */
interface PageState {
  // Текущая детальная страница
  currentPage: PageWithDetails | null;
  // Список страниц для отображения
  pagesList: PageWithAuthor[];
  // Флаг загрузки
  loading: boolean;
  // Общее количество страниц (для пагинации)
  totalPages: number;
  // Ошибка
  error: string | null;
  
  // Действия
  setCurrentPage: (page: PageWithDetails | null) => void;
  setPagesList: (pages: PageWithAuthor[]) => void;
  setLoading: (loading: boolean) => void;
  setTotalPages: (total: number) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Вспомогательные методы
  updatePage: (updatedPage: Partial<Page> & { id: string }) => void;
  addPageToList: (page: PageWithAuthor) => void;
  removePageFromList: (pageId: string) => void;
  reset: () => void;
}

/**
 * Стор для управления состоянием страниц
 */
export const usePageStore = createStore<PageState>((set) => ({
  // Начальное состояние
  currentPage: null,
  pagesList: [],
  loading: false,
  totalPages: 0,
  error: null,
  
  // Действия
  setCurrentPage: (page) => set((state) => {
    state.currentPage = page;
    return state;
  }),
  
  setPagesList: (pages) => set((state) => {
    state.pagesList = pages;
    return state;
  }),
  
  setLoading: (loading) => set((state) => {
    state.loading = loading;
    return state;
  }),
  
  setTotalPages: (total) => set((state) => {
    state.totalPages = total;
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
  
  // Обновление страницы в списке и текущей страницы
  updatePage: (updatedPage) => set((state) => {
    // Обновляем в списке если есть
    state.pagesList = state.pagesList.map(page => 
      page.id === updatedPage.id 
        ? { ...page, ...updatedPage } 
        : page
    );
    
    // Обновляем текущую страницу если это она
    if (state.currentPage && state.currentPage.id === updatedPage.id) {
      state.currentPage = { ...state.currentPage, ...updatedPage };
    }
    
    return state;
  }),
  
  // Добавление страницы в список
  addPageToList: (page) => set((state) => {
    // Проверяем, нет ли уже такой страницы
    const exists = state.pagesList.some(p => p.id === page.id);
    
    // Если страницы нет, добавляем в начало списка
    if (!exists) {
      state.pagesList = [page, ...state.pagesList];
      state.totalPages += 1;
    }
    
    return state;
  }),
  
  // Удаление страницы из списка
  removePageFromList: (pageId) => set((state) => {
    state.pagesList = state.pagesList.filter(page => page.id !== pageId);
    
    // Если это текущая страница, сбрасываем ее
    if (state.currentPage && state.currentPage.id === pageId) {
      state.currentPage = null;
    }
    
    // Обновляем общее количество
    if (state.totalPages > 0) {
      state.totalPages -= 1;
    }
    
    return state;
  }),
  
  // Сброс состояния
  reset: () => set((state) => {
    state.currentPage = null;
    state.pagesList = [];
    state.loading = false;
    state.error = null;
    state.totalPages = 0;
    return state;
  }),
}), 'page-store'); 