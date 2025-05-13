/**
 * Фиксы для типов
 */

// Фиксы для Zustand
declare module 'zustand' {
  export function create<T>(): any;
  
  export interface StoreApi<T> {
    getState: () => T;
    setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
    subscribe: (listener: (state: T, prevState: T) => void) => () => void;
  }
  
  export type UseBoundStore<T> = any;
  export type StateCreator<T, K extends any[] = any[]> = any;
}

declare module 'zustand/middleware/immer' {
  export function immer<T>(fn: any): any;
}

declare module 'zustand/middleware' {
  export function devtools<T>(fn: any, options?: any): any;
  export function persist<T>(fn: any, options?: any): any;
}

// Определяем глобальный window.performance
interface Performance {
  now(): number;
}

declare global {
  interface Window {
    performance: Performance;
  }
}
