/**
 * Кэш-менеджер для оптимизации запросов к БД
 */
import { logger } from '../logger';

/**
 * Опции кэширования
 */
export interface CacheOptions {
  /** Время жизни кэша в миллисекундах */
  ttl: number;
  
  /** Максимальный размер кэша (количество элементов) */
  maxSize?: number;
}

/**
 * Элемент кэша с метаданными
 */
interface CacheItem<T> {
  /** Данные */
  data: T;
  
  /** Время создания */
  createdAt: number;
  
  /** Время последнего доступа */
  lastAccessed: number;
  
  /** Счетчик обращений */
  hitCount: number;
}

/**
 * Кэш-менеджер для результатов БД запросов
 */
export class QueryCacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private defaultOptions: CacheOptions = { ttl: 60000, maxSize: 100 };
  
  constructor(options?: Partial<CacheOptions>) {
    this.defaultOptions = { ...this.defaultOptions, ...options };
    
    // Запускаем периодическую очистку устаревших данных
    setInterval(() => this.cleanExpiredItems(), this.defaultOptions.ttl);
  }
  
  /**
   * Создает ключ кэша из SQL-запроса и параметров
   */
  private createCacheKey(sql: string, params: any[]): string {
    return `${sql}:${JSON.stringify(params)}`;
  }
  
  /**
   * Получает элемент из кэша
   */
  get<T>(sql: string, params: any[] = []): T | null {
    const key = this.createCacheKey(sql, params);
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Проверяем истек ли срок кэша
    if (Date.now() - item.createdAt > this.defaultOptions.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Обновляем метаданные доступа
    item.lastAccessed = Date.now();
    item.hitCount++;
    
    logger.debug(`Cache hit for query: ${sql.substring(0, 50)}...`);
    return item.data;
  }
  
  /**
   * Сохраняет элемент в кэш
   */
  set<T>(sql: string, params: any[] = [], data: T): void {
    const key = this.createCacheKey(sql, params);
    
    // Проверяем размер кэша
    if (this.cache.size >= (this.defaultOptions.maxSize || 100)) {
      this.evictLeastUsed();
    }
    
    this.cache.set(key, {
      data,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      hitCount: 0
    });
    
    logger.debug(`Cached query: ${sql.substring(0, 50)}...`);
  }
  
  /**
   * Удаляет элемент из кэша
   */
  invalidate(sql: string, params: any[] = []): void {
    const key = this.createCacheKey(sql, params);
    this.cache.delete(key);
  }
  
  /**
   * Очищает весь кэш
   */
  clear(): void {
    this.cache.clear();
    logger.debug('Query cache cleared');
  }
  
  /**
   * Очищает устаревшие элементы кэша
   */
  private cleanExpiredItems(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.createdAt > this.defaultOptions.ttl) {
        this.cache.delete(key);
        expiredCount++;
      }
    }
    
    if (expiredCount > 0) {
      logger.debug(`Removed ${expiredCount} expired cache items`);
    }
  }
  
  /**
   * Удаляет наименее используемые элементы
   */
  private evictLeastUsed(): void {
    if (this.cache.size === 0) return;
    
    let leastUsedKey: string | null = null;
    let leastUsedItem: CacheItem<any> | null = null;
    
    for (const [key, item] of this.cache.entries()) {
      if (
        !leastUsedItem || 
        item.hitCount < leastUsedItem.hitCount ||
        (item.hitCount === leastUsedItem.hitCount && item.lastAccessed < leastUsedItem.lastAccessed)
      ) {
        leastUsedKey = key;
        leastUsedItem = item;
      }
    }
    
    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
      logger.debug('Evicted least used cache item');
    }
  }
  
  /**
   * Возвращает статистику использования кэша
   */
  getStats(): { size: number; hitRate: number } {
    let totalHits = 0;
    let totalItems = this.cache.size;
    
    for (const item of this.cache.values()) {
      totalHits += item.hitCount;
    }
    
    const hitRate = totalItems > 0 ? totalHits / totalItems : 0;
    
    return {
      size: totalItems,
      hitRate
    };
  }
}

// Экспортируем глобальный экземпляр кэш-менеджера
export const queryCache = new QueryCacheManager({ ttl: 30000, maxSize: 200 });
