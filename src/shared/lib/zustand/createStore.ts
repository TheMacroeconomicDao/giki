import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

/**
 * Создает Zustand стор с поддержкой immer и devtools
 * 
 * @param storeCreator Функция создания стора
 * @returns Хук для использования стора
 */
export function createStore<T>(storeCreator: (set: any, get: any) => T, name?: string) {
  return create<T>()(
    devtools(
      immer(storeCreator),
      { name: name || 'unnamed-store' }
    )
  );
} 