import { API_BASE_URL } from '../config';

/**
 * Базовые опции для запросов
 */
export interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

/**
 * Базовый API клиент для запросов к бэкенду
 */
export const baseApi = {
  /**
   * Выполнить GET запрос
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  /**
   * Выполнить POST запрос
   */
  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Выполнить PUT запрос
   */
  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Выполнить PATCH запрос
   */
  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Выполнить DELETE запрос
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },

  /**
   * Базовый метод для выполнения запросов
   */
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    
    // Формируем URL с query params
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value);
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Добавляем headers по умолчанию
    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
      headers.append('Content-Type', 'application/json');
    }
    
    // Выполняем запрос
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Обрабатываем ошибки
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      
      throw {
        status: response.status,
        message: errorData.message || 'Произошла ошибка при выполнении запроса',
        data: errorData,
      };
    }

    // Если ответ пустой или нет контента
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    // Парсим JSON ответ
    return await response.json() as T;
  },
}; 