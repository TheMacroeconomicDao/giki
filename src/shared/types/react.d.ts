/**
 * Заглушки для React типов
 */

// Это позволит использовать импорт React даже если модуль недоступен
declare module 'react' {
  export type ReactNode = React.ReactNode;
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  export function useContext<T>(context: React.Context<T>): T;
  export function createContext<T>(defaultValue: T): React.Context<T>;
  export function useRef<T>(initialValue: T): { current: T };
  export const Fragment: unique symbol;
  export interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string;
  }
  export interface Provider<T> {
    $$typeof: symbol;
    props: {
      value: T;
      children?: ReactNode;
    };
  }
  export interface Consumer<T> {
    $$typeof: symbol;
    props: {
      children: (value: T) => ReactNode;
    };
  }
}
