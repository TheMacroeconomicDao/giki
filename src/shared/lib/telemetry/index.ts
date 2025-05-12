/**
 * Модуль телеметрии для трассировки и метрик
 * @module
 */

import { logger } from '@/shared/lib/logger';

/**
 * Уровни детализации логирования
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

/**
 * Метаданные трассировки
 */
export interface TraceMetadata {
  /** Идентификатор запроса */
  requestId: string;
  
  /** Имя операции */
  operation: string;
  
  /** Пользователь */
  userId?: string;
  
  /** Дополнительные атрибуты */
  attributes?: Record<string, any>;
}

/**
 * Информация о спане трассировки
 */
export interface SpanInfo {
  /** Идентификатор спана */
  id: string;
  
  /** Идентификатор родительского спана */
  parentId?: string;
  
  /** Метаданные трассировки */
  metadata: TraceMetadata;
  
  /** Время начала в мс */
  startTime: number;
  
  /** Время окончания в мс */
  endTime?: number;
  
  /** Статус */
  status: 'success' | 'error';
  
  /** Ошибка, если есть */
  error?: Error;
  
  /** События в спане */
  events: {
    name: string;
    timestamp: number;
    attributes?: Record<string, any>;
  }[];
}

/**
 * Генерирует уникальный ID
 */
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Активные спаны
 */
const activeSpans = new Map<string, SpanInfo>();

/**
 * Глобальный контекст для передачи между компонентами
 */
let globalContext: Record<string, any> = {};

/**
 * Создает новый спан трассировки
 */
export function startSpan(
  operation: string,
  metadata?: Partial<TraceMetadata>,
  parentSpanId?: string
): string {
  const requestId = metadata?.requestId || generateId();
  
  const spanId = generateId();
  
  // Собираем полные метаданные
  const fullMetadata: TraceMetadata = {
    requestId,
    operation,
    userId: metadata?.userId,
    attributes: {
      ...metadata?.attributes,
    },
  };
  
  // Создаем спан
  const span: SpanInfo = {
    id: spanId,
    parentId: parentSpanId,
    metadata: fullMetadata,
    startTime: Date.now(),
    status: 'success',
    events: [],
  };
  
  // Добавляем в активные спаны
  activeSpans.set(spanId, span);
  
  logger.info(`[Trace] Started ${operation}`, { spanId, requestId });
  
  return spanId;
}

/**
 * Добавляет событие в спан
 */
export function addSpanEvent(
  spanId: string,
  name: string,
  attributes?: Record<string, any>
): void {
  const span = activeSpans.get(spanId);
  
  if (!span) {
    logger.warn(`[Trace] Span not found: ${spanId}`);
    return;
  }
  
  span.events.push({
    name,
    timestamp: Date.now(),
    attributes,
  });
  
  logger.debug(`[Trace] Event ${name} in ${span.metadata.operation}`, { 
    spanId, 
    attributes 
  });
}

/**
 * Завершает спан
 */
export function endSpan(
  spanId: string,
  status: 'success' | 'error' = 'success',
  error?: Error
): SpanInfo | null {
  const span = activeSpans.get(spanId);
  
  if (!span) {
    logger.warn(`[Trace] Trying to end non-existent span: ${spanId}`);
    return null;
  }
  
  // Обновляем данные спана
  span.endTime = Date.now();
  span.status = status;
  
  if (error) {
    span.error = error;
  }
  
  // Вычисляем продолжительность
  const duration = span.endTime - span.startTime;
  
  // Логируем завершение
  if (status === 'success') {
    logger.info(`[Trace] Completed ${span.metadata.operation} in ${duration}ms`, { 
      spanId, 
      duration 
    });
  } else {
    logger.error(`[Trace] Failed ${span.metadata.operation} after ${duration}ms`, { 
      spanId, 
      duration, 
      error: error?.message 
    });
  }
  
  // Удаляем из активных
  activeSpans.delete(spanId);
  
  return span;
}

/**
 * Декоратор для трассировки методов класса
 */
export function Traced(operationName?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      const operation = operationName || `${target.constructor.name}.${propertyKey}`;
      const spanId = startSpan(operation);
      
      try {
        const result = await originalMethod.apply(this, args);
        endSpan(spanId, 'success');
        return result;
      } catch (error) {
        endSpan(spanId, 'error', error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    };
    
    return descriptor;
  };
}

/**
 * Устанавливает глобальный контекст трассировки
 */
export function setGlobalContext(key: string, value: any): void {
  globalContext[key] = value;
}

/**
 * Получает значение из глобального контекста
 */
export function getFromGlobalContext<T>(key: string): T | undefined {
  return globalContext[key] as T;
}

/**
 * Очищает глобальный контекст
 */
export function clearGlobalContext(): void {
  globalContext = {};
}

/**
 * Метрики производительности
 */
export const metrics = {
  /**
   * Счетчики для различных событий
   */
  counters: new Map<string, number>(),
  
  /**
   * Гистограммы для измерения времени
   */
  histograms: new Map<string, number[]>(),
  
  /**
   * Увеличивает счетчик
   */
  increment(name: string, value: number = 1): void {
    const current = this.counters.get(name) || 0;
    this.counters.set(name, current + value);
  },
  
  /**
   * Добавляет значение в гистограмму
   */
  recordValue(name: string, value: number): void {
    if (!this.histograms.has(name)) {
      this.histograms.set(name, []);
    }
    this.histograms.get(name)?.push(value);
  },
  
  /**
   * Возвращает текущее значение счетчика
   */
  getCounter(name: string): number {
    return this.counters.get(name) || 0;
  },
  
  /**
   * Возвращает статистику по гистограмме
   */
  getHistogramStats(name: string): {
    min: number;
    max: number;
    avg: number;
    p95: number;
    count: number;
  } | null {
    const values = this.histograms.get(name);
    
    if (!values || values.length === 0) {
      return null;
    }
    
    const sorted = [...values].sort((a, b) => a - b);
    const count = sorted.length;
    
    return {
      min: sorted[0],
      max: sorted[count - 1],
      avg: sorted.reduce((sum, val) => sum + val, 0) / count,
      p95: sorted[Math.floor(count * 0.95)],
      count
    };
  }
};

/**
 * Замеряет время выполнения функции
 */
export async function measureTime<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  
  try {
    return await fn();
  } finally {
    const duration = Date.now() - start;
    metrics.recordValue(name, duration);
    logger.debug(`[Metrics] ${name}: ${duration}ms`);
  }
}

export const telemetry = {
  startSpan,
  endSpan,
  addSpanEvent,
  Traced,
  setGlobalContext,
  getFromGlobalContext,
  clearGlobalContext,
  metrics,
  measureTime,
};

export default telemetry;
