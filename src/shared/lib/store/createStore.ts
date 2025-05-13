import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

/**
 * Создаёт стор с поддержкой immer и devtools
 */
export function createStore<T extends object>(
  initialState: T,
  name: string,
) {
  return create<T>()(
    devtools(
      immer(() => initialState),
      { name }
    )
  );
}
