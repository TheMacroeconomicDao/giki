/**
 * Модуль создания сторов Zustand по FSD архитектуре
 * С телеметрией, логированием, персистентностью и инструментами разработчика
 */

// @ts-nocheck - подавляем ошибки типизации с Zustand

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';
import { telemetry } from '@/shared/lib/telemetry';
import { logger } from '@/shared/lib/logger';

/**
 * Опции для стора
 */
interface StoreOptions<T> {
  /** Уникальное имя стора */
  name: string;
  
  /** Настройки персистентности */
  persist?: {
    name?: string;
    getStorage?: () => Storage;
    partialize?: (state: T) => Partial<T>;
    version?: number;
    migrate?: (state: any, version: number) => T;
  };
  
  /** Логировать действия */
  enableLogging?: boolean;
  
  /** Телеметрия */
  enableTelemetry?: boolean;
  
  /** Инструменты разработчика */
  devtools?: {
    enabled?: boolean;
    anonymousActionType?: string;
  };
  
  /** Игнорируемые действия для логирования */
  silentActions?: string[];
}

/**
 * Создает стор Zustand с дополнительными функциями
 */
export function createStore<TState extends object, TActions extends object>(
  initializer: any,
  options: StoreOptions<TState & TActions> = { name: 'unnamed' }
) {
  const {
    name = 'unnamed',
    persist: persistOptions,
    enableLogging = false,
    enableTelemetry = false,
    devtools = { enabled: true },
    silentActions = []
  } = options;
  
  // Добавляем логгирование
  const withLogging = (config: any) => (set: any, get: any, api: any) => {
    return config(
      (args: any) => {
        const actionName = args?.type || 'setState';
        const result = set(args);
        
        if (enableLogging && !silentActions.includes(actionName)) {
          logger.debug(`[Store:${name}] ${actionName}:`, {
            state: get(),
            args,
          });
        }
        
        return result;
      },
      get,
      api
    );
  };
  
  // Добавляем телеметрию
  const withTelemetry = (config: any) => (set: any, get: any, api: any) => {
    return config(
      (args: any) => {
        const actionName = args?.type || 'setState';
        let spanId;
        
        if (enableTelemetry) {
          spanId = telemetry.startSpan(`store.${name}.${actionName}`, {
            attributes: { storeName: name, action: actionName }
          });
        }
        
        try {
          const result = set(args);
          
          if (enableTelemetry && spanId) {
            telemetry.endSpan(spanId, 'success');
          }
          
          return result;
        } catch (error) {
          if (enableTelemetry && spanId) {
            telemetry.endSpan(spanId, 'error', error instanceof Error ? error : new Error(String(error)));
          }
          
          throw error;
        }
      },
      get,
      api
    );
  };
  
  // Начинаем с immer для удобного обновления состояния
  let storeCreator = immer(initializer);
  
  // Добавляем телеметрию, если включена
  if (enableTelemetry) {
    storeCreator = withTelemetry(storeCreator);
  }
  
  // Добавляем логгирование, если включено
  if (enableLogging) {
    storeCreator = withLogging(storeCreator);
  }
  
  // Добавляем персистентность, если настроена
  if (persistOptions) {
    storeCreator = persist(storeCreator, {
      name: persistOptions.name || `giki-store-${name}`,
      ...persistOptions
    });
  }
  
  // Добавляем инструменты разработчика в режиме разработки
  if (typeof process !== 'undefined' && 
      process.env && 
      process.env.NODE_ENV !== 'production' && 
      devtools.enabled !== false) {
    storeCreator = devtools(storeCreator, {
      name: `giki-${name}`,
      ...devtools
    });
  }
  
  // Создаем стор
  return create(storeCreator);
}

export default createStore;

