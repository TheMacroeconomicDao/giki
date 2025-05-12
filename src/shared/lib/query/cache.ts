/**
 * Модуль кэширования запросов для оптимизации производительности
 */

import { logger } from '@/shared/lib/logger';
import { telemetry } from '@/shared/lib/telemetry';

/**
 * Кэш-ключ состоит из идентификатора ресурса и хэша параметров
 */
export type CacheKey = string;

/**
 * Статус кэшированного запроса
 */
export type QueryStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Кэшированные данные с метаинформацией
 */
export interface CachedData<T> {
  /** Данные запроса */
  data: T | null;
  
  /** Ошибка запроса */
  error: Error | null;
  
  /** Статус запроса */
  status: QueryStatus;
  
  /** Время последнего обновления */
  timestamp: number;
  
  /** Маркер устаревания данных */
  stale: boolean;
  
  /** Ключ кэша */
  key: CacheKey;
}

/**
 * Опции запроса
 */
export interface QueryOptions {
  /** Время жизни кэша в мс */
  ttl?: number;
  
  /** Обновлять в фоне при получении устаревших данных */
  staleWhileRevalidate?: boolean;
  
  /** Повторять запрос при ошибке */
  retry?: boolean | number;
  
  /** Задержка между повторами в мс */
  retryDelay?: number;
  
  /** Тип кэширования */
  cacheType?: 'memory' | 'sessionStorage' | 'localStorage';
}

// Дефолтные опции запроса
const DEFAULT_OPTIONS: QueryOptions = {
  ttl: 60 * 1000, // 1 минута
  staleWhileRevalidate: true,
  retry: 3,
  retryDelay: 1000,
  cacheType: 'memory',
};

/**
 * Менеджер кэша для запросов
 */
export class QueryCache {
  // Кэш в памяти
  private memoryCache = new Map<CacheKey, CachedData<any>>();
  
  // Активные запросы (промисы)
  private activeQueries = new Map<CacheKey, Promise<any>>();
  
  // Подписчики на обновления кэша
  private listeners = new Map<CacheKey, Set<() => void>>();
  
  /**
   * Генерирует ключ кэша
   */
  generateKey(resource: string, params?: any): CacheKey {
    const paramsHash = params ? JSON.stringify(params) : '';
    return `${resource}:${paramsHash}`;
  }
  
  /**
   * Получает данные из кэша
   */
  get<T>(key: CacheKey): CachedData<T> | null {
    // Сначала пробуем из памяти
    const memoryData = this.memoryCache.get(key) as CachedData<T>;
    
    if (memoryData) {
      return memoryData;
    }
    
    // Затем из sessionStorage
    try {
      const sessionData = sessionStorage.getItem(`giki_query_${key}`);
      if (sessionData) {
        const parsedData = JSON.parse(sessionData) as CachedData<T>;
        // Положим в memory cache для быстрого доступа
        this.memoryCache.set(key, parsedData);
        return parsedData;
      }
    } catch (e) {
      // Игнорируем ошибки sessionStorage
    }
    
    // Наконец из localStorage
    try {
      const localData = localStorage.getItem(`giki_query_${key}`);
      if (localData) {
        const parsedData = JSON.parse(localData) as CachedData<T>;
        this.memoryCache.set(key, parsedData);
        return parsedData;
      }
    } catch (e) {
      // Игнорируем ошибки localStorage
    }
    
    return null;
  }
  
  /**
   * Сохраняет данные в кэш
   */
  set<T>(key: CacheKey, data: CachedData<T>, options: QueryOptions = {}): void {
    const { cacheType } = { ...DEFAULT_OPTIONS, ...options };
    
    // Всегда кэшируем в памяти
    this.memoryCache.set(key, data);
    
    // Дополнительно кэшируем в sessionStorage
    if (cacheType === 'sessionStorage' || cacheType === 'localStorage') {
      try {
        sessionStorage.setItem(`giki_query_${key}`, JSON.stringify(data));
      } catch (e) {
        logger.warn('Failed to cache in sessionStorage', e);
      }
    }
    
    // Дополнительно кэшируем в localStorage для долгого хранения
    if (cacheType === 'localStorage') {
      try {
        localStorage.setItem(`giki_query_${key}`, JSON.stringify(data));
      } catch (e) {
        logger.warn('Failed to cache in localStorage', e);
      }
    }
    
    // Уведомляем подписчиков
    this.notifyListeners(key);
  }
  
  /**
   * Проверяет, устарел ли кэш
   */
  isStale<T>(cachedData: CachedData<T>, options: QueryOptions = {}): boolean {
    const { ttl } = { ...DEFAULT_OPTIONS, ...options };
    const now = Date.now();
    
    return now - cachedData.timestamp > ttl!;
  }
  
  /**
   * Устанавливает флаг устаревания для кэша
   */
  markAsStale(key: CacheKey): void {
    const data = this.memoryCache.get(key);
    
    if (data) {
      data.stale = true;
      this.memoryCache.set(key, data);
      this.notifyListeners(key);
    }
  }
  
  /**
   * Удаляет данные из кэша
   */
  invalidate(key: CacheKey): void {
    this.memoryCache.delete(key);
    
    try {
      sessionStorage.removeItem(`giki_query_${key}`);
      localStorage.removeItem(`giki_query_${key}`);
    } catch (e) {
      // Игнорируем ошибки хранилища
    }
    
    this.notifyListeners(key);
  }
  
  /**
   * Очищает весь кэш
   */
  clear(): void {
    this.memoryCache.clear();
    
    try {
      // Очищаем только ключи, связанные с запросами
      Object.keys(sessionStorage)
        .filter(key => key.startsWith('giki_query_'))
        .forEach(key => sessionStorage.removeItem(key));
        
      Object.keys(localStorage)
        .filter(key => key.startsWith('giki_query_'))
        .forEach(key => localStorage.removeItem(key));
    } catch (e) {
      // Игнорируем ошибки хранилища
    }
    
    // Уведомляем всех подписчиков
    this.listeners.forEach((listeners, key) => {
      listeners.forEach(listener => listener());
    });
  }
  
  /**
   * Добавляет подписчика на изменения кэша
   */
  subscribe(key: CacheKey, listener: () => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    
    this.listeners.get(key)!.add(listener);
    
    // Возвращаем функцию отписки
    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }
  
  /**
   * Уведомляет подписчиков об изменении кэша
   */
  private notifyListeners(key: CacheKey): void {
    const listeners = this.listeners.get(key);
    
    if (listeners) {
      listeners.forEach(listener => listener());
    }
  }
  
  /**
   * Выполняет запрос с кэшированием
   */
  async query<T, P = any>(
    resource: string,
    fetcher: (params: P) => Promise<T>,
    params: P,
    options: QueryOptions = {}
  ): Promise<CachedData<T>> {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    const key = this.generateKey(resource, params);
    
    // Отслеживаем запрос
    const spanId = telemetry.startSpan('query', { 
      resource, 
      params: JSON.stringify(params) 
    });
    
    try {
      // Проверяем кэш
      const cachedData = this.get<T>(key);
      
      // Если есть кэшированные данные и они не устарели
      if (cachedData && !this.isStale(cachedData, mergedOptions)) {
        telemetry.addSpanEvent(spanId, 'cache_hit', { fresh: true });
        return cachedData;
      }
      
      // Если есть кэшированные данные, но они устарели
      if (cachedData && mergedOptions.staleWhileRevalidate) {
        // Запускаем обновление в фоне
        this.revalidate(key, fetcher, params, mergedOptions);
        
        telemetry.addSpanEvent(spanId, 'cache_hit', { stale: true });
        return {
          ...cachedData,
          stale: true
        };
      }
      
      // Если уже есть активный запрос с этим ключом, ждем его
      if (this.activeQueries.has(key)) {
        telemetry.addSpanEvent(spanId, 'pending_query');
        return await this.activeQueries.get(key)!;
      }
      
      // Выполняем новый запрос
      const queryPromise = this.executeQuery<T, P>(key, fetcher, params, mergedOptions);
      this.activeQueries.set(key, queryPromise);
      
      try {
        const result = await queryPromise;
        return result;
      } finally {
        this.activeQueries.delete(key);
      }
    } finally {
      telemetry.endSpan(spanId);
    }
  }
  
  /**
   * Выполняет запрос и обновляет кэш
   */
  private async executeQuery<T, P>(
    key: CacheKey,
    fetcher: (params: P) => Promise<T>,
    params: P,
    options: QueryOptions
  ): Promise<CachedData<T>> {
    // Устанавливаем состояние загрузки
    const loadingState: CachedData<T> = {
      data: null,
      error: null,
      status: 'loading',
      timestamp: Date.now(),
      stale: false,
      key
    };
    
    this.set(key, loadingState, options);
    
    let retries = 0;
    const maxRetries = typeof options.retry === 'number' 
      ? options.retry 
      : (options.retry ? 3 : 0);
      
    while (true) {
      try {
        const data = await fetcher(params);
        
        // Создаем и сохраняем результат
        const result: CachedData<T> = {
          data,
          error: null,
          status: 'success',
          timestamp: Date.now(),
          stale: false,
          key
        };
        
        this.set(key, result, options);
        return result;
      } catch (error) {
        // Если это последняя попытка или повторы отключены
        if (retries >= maxRetries) {
          const errorState: CachedData<T> = {
            data: null,
            error: error instanceof Error ? error : new Error(String(error)),
            status: 'error',
            timestamp: Date.now(),
            stale: false,
            key
          };
          
          this.set(key, errorState, options);
          return errorState;
        }
        
        // Увеличиваем счетчик попыток
        retries++;
        
        // Ждем перед повтором
        await new Promise(resolve => 
          setTimeout(resolve, options.retryDelay || 1000)
        );
      }
    }
  }
  
  /**
   * Обновляет устаревшие данные в фоне
   */
  private async revalidate<T, P>(
    key: CacheKey,
    fetcher: (params: P) => Promise<T>,
    params: P,
    options: QueryOptions
  ): Promise<void> {
    // Не запускаем повторную ревалидацию, если уже есть активный запрос
    if (this.activeQueries.has(key)) {
      return;
    }
    
    // Запускаем запрос в фоне
    const queryPromise = this.executeQuery<T, P>(key, fetcher, params, options);
    this.activeQueries.set(key, queryPromise);
    
    try {
      await queryPromise;
    } catch (error) {
      logger.error('Background revalidation failed', error);
    } finally {
      this.activeQueries.delete(key);
    }
  }
}

// Экспортируем синглтон
export const queryCache = new QueryCache();

export default queryCache;
