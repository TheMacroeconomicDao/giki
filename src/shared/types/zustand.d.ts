/**
 * Типы для Zustand
 */

declare module 'zustand' {
  export type StateCreator<T, Mutators = [], StoreMutators = []> = (
    setState: SetState<T>,
    getState: GetState<T>,
    api: StoreApi<T>
  ) => T;

  export type GetState<T> = () => T;
  export type SetState<T> = (
    partial: T | Partial<T> | ((state: T) => T | Partial<T>),
    replace?: boolean
  ) => void;

  export interface StoreApi<T> {
    getState: GetState<T>;
    setState: SetState<T>;
    subscribe: (listener: (state: T, prevState: T) => void) => () => void;
    destroy: () => void;
  }

  export function create<T>(initializer: StateCreator<T>): StoreApi<T>;
}

declare module 'zustand/middleware/immer' {
  import { StateCreator } from 'zustand';
  
  export function immer<T, Mutators = [], StoreMutators = []>(
    initializer: StateCreator<T, [...Mutators, ['zustand/immer', never]], StoreMutators>
  ): StateCreator<T, Mutators, StoreMutators>;
}

declare module 'zustand/middleware' {
  import { StateCreator, StoreApi } from 'zustand';
  
  export interface PersistOptions<T> {
    name: string;
    getStorage?: () => Storage;
    partialize?: (state: T) => Partial<T>;
    onRehydrateStorage?: (state: T | undefined) => ((state: T | undefined, error: Error | null) => void) | void;
    version?: number;
    migrate?: (persistedState: any, version: number) => T | Promise<T>;
    merge?: (persistedState: any, currentState: T) => T;
    skipHydration?: boolean;
  }
  
  export function persist<T, Mutators = [], StoreMutators = []>(
    initializer: StateCreator<T, Mutators, StoreMutators>,
    options: PersistOptions<T>
  ): StateCreator<T, Mutators, StoreMutators>;
  
  export function devtools<T, Mutators = [], StoreMutators = []>(
    initializer: StateCreator<T, Mutators, StoreMutators>,
    options?: {
      name?: string;
      enabled?: boolean;
      serialize?: {
        options?: boolean | {
          date?: boolean;
          regex?: boolean;
          undefined?: boolean;
          error?: boolean;
          infinity?: boolean;
          nan?: boolean;
          function?: boolean | ((fn: Function) => string);
        };
        replacer?: (key: string, value: unknown) => unknown;
        reviver?: (key: string, value: unknown) => unknown;
      }
    }
  ): StateCreator<T, Mutators, StoreMutators>;
}
