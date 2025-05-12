import { Page, PageVisibility } from '@/entities/page';

/**
 * Параметры компонента PageEdit
 */
export interface PageEditParams {
  id?: string; // ID страницы, если редактируем существующую
}

/**
 * Параметры компонента PageEdit
 */
export interface PageEditProps {
  id?: string; // ID страницы, если редактируем существующую
}

/**
 * Состояние компонента редактирования страницы
 */
export interface PageEditState {
  loading: boolean;
  saving: boolean;
  error: string | null;
  page: Page | null;
  title: string;
  content: string;
  visibility: PageVisibility;
  isModified: boolean; // Флаг изменения для предупреждения при уходе
}

/**
 * Данные формы редактирования страницы
 */
export interface PageEditFormData {
  title: string;
  content: string;
  visibility: PageVisibility;
} 