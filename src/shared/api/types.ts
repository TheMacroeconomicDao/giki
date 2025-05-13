/**
 * Базовые типы для API
 */

/**
 * Базовый ответ API
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Ошибка API
 */
export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Параметры пагинации
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Ответ с пагинацией
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
