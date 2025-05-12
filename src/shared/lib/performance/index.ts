/**
 * Модуль мониторинга производительности
 */

import { logger } from '@/shared/lib/logger';
import { telemetry } from '@/shared/lib/telemetry';

/**
 * Результат метрики
 */
interface MetricResult {
  /** Название метрики */
  name: string;
  
  /** Длительность в мс */
  duration: number;
  
  /** Тип метрики */
  type: 'network' | 'resource' | 'render' | 'memory' | 'paint' | 'user';
  
  /** Статус */
  status: 'good' | 'warn' | 'error';
}

/**
 * Трешхолды метрик для производительности
 */
const thresholds = {
  fcp: { warn: 1800, error: 3000 }, // First Contentful Paint
  lcp: { warn: 2500, error: 4000 }, // Largest Contentful Paint
  fid: { warn: 100, error: 300 },   // First Input Delay
  cls: { warn: 0.1, error: 0.25 },  // Cumulative Layout Shift
  ttfb: { warn: 600, error: 1800 }, // Time to First Byte
};

/**
 * Единичные метрики
 */
const metrics: Record<string, MetricResult> = {};

/**
 * Измерения во времени
 */
const timeseries: Record<string, { timestamp: number, value: number }[]> = {};

/**
 * Текущие незавершенные измерения
 */
const pendingMeasures = new Map<string, number>();

/**
 * Начинает измерение
 */
export function startMeasure(name: string): void {
  // Проверяем наличие Performance API
  if (typeof window !== 'undefined' && window.performance) {
    pendingMeasures.set(name, window.performance.now());
  } else {
    pendingMeasures.set(name, Date.now());
  }
}

/**
 * Завершает измерение
 */
export function endMeasure(name: string, type: MetricResult['type'] = 'user'): void {
  const startTime = pendingMeasures.get(name);
  
  if (!startTime) {
    logger.warn(`[Performance] No matching startMeasure for ${name}`);
    return;
  }
  
  // Проверяем наличие Performance API
  let endTime: number;
  if (typeof window !== 'undefined' && window.performance) {
    endTime = window.performance.now();
  } else {
    endTime = Date.now();
  }
  
  const duration = endTime - startTime;
  pendingMeasures.delete(name);
  
  recordMetric(name, duration, type);
}

/**
 * Записывает метрику производительности
 */
export function recordMetric(
  name: string, 
  duration: number, 
  type: MetricResult['type'] = 'user'
): void {
  // Определяем статус метрики
  let status: MetricResult['status'] = 'good';
  
  if (thresholds[name as keyof typeof thresholds]) {
    const { warn, error } = thresholds[name as keyof typeof thresholds];
    
    if (duration >= error) {
      status = 'error';
    } else if (duration >= warn) {
      status = 'warn';
    }
  }
  
  // Сохраняем метрику
  metrics[name] = { name, duration, type, status };
  
  // Добавляем в таймсерию
  if (!timeseries[name]) {
    timeseries[name] = [];
  }
  
  timeseries[name].push({
    timestamp: Date.now(),
    value: duration
  });
  
  // Ограничиваем размер таймсерии
  if (timeseries[name].length > 100) {
    timeseries[name].shift();
  }
  
  // Логируем и отправляем в телеметрию
  telemetry.metrics.recordValue(`perf.${name}`, duration);
  
  if (status === 'error') {
    logger.error(`[Performance] Slow ${name}: ${duration.toFixed(2)}ms`);
  } else if (status === 'warn') {
    logger.warn(`[Performance] ${name} needs optimization: ${duration.toFixed(2)}ms`);
  } else {
    logger.debug(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }
}

/**
 * Получает все метрики
 */
export function getMetrics(): Record<string, MetricResult> {
  return { ...metrics };
}

/**
 * Получает временную серию метрики
 */
export function getTimeseries(name: string): { timestamp: number, value: number }[] {
  return timeseries[name] || [];
}

/**
 * Отслеживает Web Vitals с помощью PerformanceObserver
 */
export function observeWebVitals(): void {
  if (typeof window === 'undefined' || !window.PerformanceObserver) {
    return;
  }
  
  // LCP (Largest Contentful Paint)
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        recordMetric('lcp', lastEntry.startTime, 'paint');
      }
    });
    
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    logger.error('Failed to observe LCP', e);
  }
  
  // FCP (First Contentful Paint)
  try {
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const firstEntry = entries[0];
      
      if (firstEntry) {
        recordMetric('fcp', firstEntry.startTime, 'paint');
      }
    });
    
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch (e) {
    logger.error('Failed to observe FCP', e);
  }
  
  // CLS (Cumulative Layout Shift)
  try {
    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];
    
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      
      entries.forEach(entry => {
        // @ts-ignore - layout-shift свойства не определены в типах
        if (!entry.hadRecentInput) {
          // @ts-ignore
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      });
      
      recordMetric('cls', clsValue, 'paint');
    });
    
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    logger.error('Failed to observe CLS', e);
  }
  
  // FID (First Input Delay)
  try {
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const firstEntry = entries[0];
      
      if (firstEntry) {
        // @ts-ignore - first-input свойства не определены в типах
        recordMetric('fid', firstEntry.processingStart - firstEntry.startTime, 'user');
      }
    });
    
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    logger.error('Failed to observe FID', e);
  }
  
  // Navigation Timing для TTFB
  try {
    const navObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const navigationEntry = entries[0] as PerformanceNavigationTiming;
      
      if (navigationEntry) {
        // TTFB (Time to First Byte)
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        recordMetric('ttfb', ttfb, 'network');
        
        // Длительность загрузки страницы
        const pageLoad = navigationEntry.loadEventEnd - navigationEntry.startTime;
        recordMetric('page-load', pageLoad, 'network');
      }
    });
    
    navObserver.observe({ type: 'navigation', buffered: true });
  } catch (e) {
    logger.error('Failed to observe Navigation Timing', e);
  }
}

// Обертка функции для измерения времени
export function measure<T extends (...args: any[]) => any>(
  name: string,
  fn: T,
  type: MetricResult['type'] = 'user'
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    startMeasure(name);
    
    try {
      const result = fn(...args);
      
      // Если результат - промис, добавляем к нему измерение окончания
      if (result instanceof Promise) {
        return result.finally(() => {
          endMeasure(name, type);
        }) as ReturnType<T>;
      }
      
      endMeasure(name, type);
      return result;
    } catch (error) {
      endMeasure(name, type);
      throw error;
    }
  };
}

export const performance = {
  startMeasure,
  endMeasure,
  recordMetric,
  getMetrics,
  getTimeseries,
  observeWebVitals,
  measure,
};

export default performance;
