/**
 * Общие типы приложения
 */

// Типы для трассировки
export interface TraceMetadata {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  spanId: string;
  parentSpanId?: string;
  status: 'success' | 'error' | 'pending';
  
  // Расширяем базовый интерфейс для поддержки дополнительных полей
  [key: string]: any;
}

// Тип для результата запроса
export interface ApiResult<T> {
  data?: T;
  error?: Error;
  loading: boolean;
  status: 'idle' | 'loading' | 'success' | 'error';
}
