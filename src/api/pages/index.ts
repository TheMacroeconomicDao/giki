/**
 * API для работы со страницами (FSD)
 */
import {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage
} from './handlers';
import type {
  GetPagesParams,
  CreatePageData,
  UpdatePageData,
  PageParams,
  GetPagesResponse,
  GetPageResponse
} from './types';

export {
  // Обработчики
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
  
  // Типы
  type GetPagesParams,
  type CreatePageData,
  type UpdatePageData,
  type PageParams,
  type GetPagesResponse,
  type GetPageResponse
}; 