/**
 * Базовый API клиент для отправки запросов к бэкенду
 */
export const baseApi = {
  /**
   * GET запрос
   */
  async get<T>(url: string, options?: RequestInit & { params?: Record<string, any> }): Promise<T> {
    try {
      // Если есть параметры, добавляем их в URL
      let finalUrl = url;
      if (options?.params) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(options.params)) {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        }
        const queryString = queryParams.toString();
        if (queryString) {
          finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
        }
        
        // Удаляем параметры из опций
        delete options.params;
      }

      const response = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {})
        },
        ...options
      });

      // Проверка статуса
      if (!response.ok) {
        throw await handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      console.error(`GET ${url} error:`, error);
      throw error;
    }
  },

  /**
   * POST запрос
   */
  async post<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {})
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options
      });

      // Проверка статуса
      if (!response.ok) {
        throw await handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      console.error(`POST ${url} error:`, error);
      throw error;
    }
  },

  /**
   * PUT запрос
   */
  async put<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {})
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options
      });

      // Проверка статуса
      if (!response.ok) {
        throw await handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      console.error(`PUT ${url} error:`, error);
      throw error;
    }
  },

  /**
   * DELETE запрос
   */
  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {})
        },
        ...options
      });

      // Проверка статуса
      if (!response.ok) {
        throw await handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      console.error(`DELETE ${url} error:`, error);
      throw error;
    }
  }
};

/**
 * Обработка ошибок ответа
 */
async function handleErrorResponse(response: Response): Promise<Error> {
  let errorMessage = `HTTP error! Status: ${response.status}`;
  
  try {
    // Пытаемся получить детали ошибки из тела ответа
    const errorData = await response.json();
    
    if (errorData.message) {
      errorMessage = errorData.message;
    } else if (errorData.error) {
      errorMessage = errorData.error;
    } else if (typeof errorData === 'string') {
      errorMessage = errorData;
    }
  } catch (e) {
    // Ничего не делаем, используем стандартное сообщение
  }
  
  const error = new Error(errorMessage);
  (error as any).status = response.status;
  (error as any).statusText = response.statusText;
  
  return error;
} 