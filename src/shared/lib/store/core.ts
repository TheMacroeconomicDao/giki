/**
 * Основа для создания стор-модулей на Zustand по FSD архитектуре
 */
import { create, StateCreator, StoreApi, UseBoundStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { persist, PersistOptions } from 'zustand/middleware';
import { logger } from '@/shared/lib/logger';
import { telemetry } from '@/shared/lib/telemetry';

/**
 * Опции для стора
 */
export interface StoreOptions<T> {
  /** Имя стора */
  name: string;
  
  /** Настройки персистентности */
  persist?: Partial<PersistOptions<T, Partial<T>>>;
  
  /** Логировать действия */
  enableLogging?: boolean;
  
  /** Включить телеметрию */
  enableTelemetry?: boolean;
}

/**
 * Factory для создания стора с миддлварами
 */
export function createStore<TState, TActions>(
  initializer: StateCreator<TState & TActions, [['zustand/immer', never]]>,
  options: StoreOptions<TState & TActions>
): UseBoundStore<StoreApi<TState & TActions>> {
  const {
    name,
    persist: persistOptions,
    enableLogging = true,
    enableTelemetry = true,
  } = options;
  
  // Добавляем логгирование
  const withLogging = <T extends TState & TActions>(
    config: StateCreator<T, [['zustand/immer', never]]>
  ): StateCreator<T, [['zustand/immer', never]]> => {
    return (set, get, api) => {
      const loggedSet: typeof set = (...args) => {
        if (enableLogging) {
          const prevState = get();
          logger.debug(`[Store:${name}] State change:`, {
            prevState,
            nextArgs: args,
          });
        }
        
        return set(...args);
      };
      
      return config(loggedSet, get, api);
    };
  };
  
  // Добавляем телеметрию
  const withTelemetry = <T extends TState & TActions>(
    config: StateCreator<T, [['zustand/immer', never]]>
  ): StateCreator<T, [['zustand/immer', never]]> => {
    return (set, get, api) => {
      // Создаем прокси для отслеживания вызовов методов
      const handler = {
        get(target: T, prop: string) {
          const value = target[prop as keyof T];
          
          // Если это функция (действие), добавляем к ней телеметрию
          if (typeof value === 'function' && enableTelemetry) {
            return function(...args: any[]) {
              const spanId = telemetry.startSpan(`store.${name}.${String(prop)}`, {
                args: JSON.stringify(args)
              });
              
              try {
                const result = value.apply(this, args);
                
                // Если результат - промис, добавляем отслеживание
                if (result instanceof Promise) {
                  return result
                    .then((res) => {
                      telemetry.endSpan(spanId, 'success');
                      return res;
                    })
                    .catch((err) => {
                      telemetry.endSpan(spanId, 'error', err);
                      throw err;
                    });
                }
                
                telemetry.endSpan(spanId, 'success');
                return result;
              } catch (err) {
                telemetry.endSpan(spanId, 'error', err instanceof Error ? err : new Error(String(err)));
                throw err;
              }
            };
          }
          
          return value;
        }
      };
      
      // Оборачиваем возвращаемый объект в прокси
      const wrapped = config(set, get, api);
      return enableTelemetry ? new Proxy(wrapped, handler) : wrapped;
    };
  };
  
  // Строим пайплайн миддлваров
  let pipeline = immer(withLogging(withTelemetry(initializer)));
  
  // Добавляем devtools для отладки
  pipeline = devtools(pipeline, { name, enabled: process.env.NODE_ENV !== 'production' });
  
  // Если нужна персистентность, добавляем persist
  if (persistOptions) {
    const defaultPersistOptions = {
      name: `giki_store_${name}`,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    };
    
    pipeline = persist(pipeline, {
      ...defaultPersistOptions,
      ...persistOptions,
    });
  }
  
  // Создаем и возвращаем стор
  return create(pipeline);
}

export default createStore;
