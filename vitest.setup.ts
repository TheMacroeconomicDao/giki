/// <reference types="vitest/globals" />
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';
import { setupDom } from 'vitest-dom/setup';

// Настраиваем матчеры DOM
setupDom();

declare global {
  namespace Vi {
    interface Assertion {
      // Добавляем все матчеры из jest-dom
      toBeInTheDocument(): Assertion;
      toBeVisible(): Assertion;
      toBeEmpty(): Assertion;
      toBeDisabled(): Assertion;
      toBeEnabled(): Assertion;
      toBeInvalid(): Assertion;
      toBeRequired(): Assertion;
      toBeValid(): Assertion;
      toBeChecked(): Assertion;
      toBePartiallyChecked(): Assertion;
      toContainElement(element: HTMLElement | null): Assertion;
      toContainHTML(htmlText: string): Assertion;
      toHaveAttribute(attr: string, value?: string): Assertion;
      toHaveClass(...classNames: string[]): Assertion;
      toHaveFocus(): Assertion;
      toHaveFormValues(expectedValues: Record<string, any>): Assertion;
      toHaveStyle(css: string | Record<string, any>): Assertion;
      toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): Assertion;
      toHaveValue(value?: string | string[] | number | null): Assertion;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): Assertion;
      toBeEmptyDOMElement(): Assertion;
      toHaveAccessibleDescription(expectedAccessibleDescription?: string | RegExp): Assertion;
      toHaveAccessibleName(expectedAccessibleName?: string | RegExp): Assertion;
      toHaveErrorMessage(expectedError?: string | RegExp): Assertion;
      
      // Добавляем стандартные jest/vitest матчеры, которые могут использоваться
      toHaveBeenCalled(): Assertion;
      toHaveBeenCalledTimes(times: number): Assertion;
      toHaveBeenCalledWith(...args: any[]): Assertion;
      toHaveBeenLastCalledWith(...args: any[]): Assertion;
      toHaveBeenNthCalledWith(n: number, ...args: any[]): Assertion;
      toHaveReturned(): Assertion;
      toHaveReturnedTimes(times: number): Assertion;
      toHaveReturnedWith(value: any): Assertion;
      toHaveLastReturnedWith(value: any): Assertion;
      toHaveNthReturnedWith(n: number, value: any): Assertion;
      toHaveLength(length: number): Assertion;
    }
    
    interface AsymmetricMatchersContaining {
      // Добавляем асимметричные матчеры
      toHaveBeenCalledWith(...args: any[]): AsymmetricMatchersContaining;
      toHaveBeenLastCalledWith(...args: any[]): AsymmetricMatchersContaining;
      toHaveReturnedWith(value: any): AsymmetricMatchersContaining;
      
      // jest-dom матчеры
      toBeInTheDocument(): AsymmetricMatchersContaining;
      toHaveTextContent(text: string | RegExp): AsymmetricMatchersContaining;
      toHaveAttribute(attr: string, value?: string): AsymmetricMatchersContaining;
      toHaveClass(...classNames: string[]): AsymmetricMatchersContaining;
      toHaveValue(value?: string | string[] | number | null): AsymmetricMatchersContaining;
    }
    
    interface ExpectStatic {
      any(constructor: any): any;
      objectContaining<T = any>(obj: T): T;
    }
  }
}

// Добавляем матчеры testing-library к expect
expect.extend(matchers);

// Запускаем очистку после каждого теста
afterEach(() => {
  cleanup();
});

// Мокаем localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Глобальный мок для fetch (можно переопределить в тестах)
global.fetch = vi.fn();

// Подавление консольных предупреждений в тестах
console.warn = vi.fn();
console.error = vi.fn();

// Мокаем IntersectionObserver
class IntersectionObserverMock {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  
  constructor() {
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
  }
  
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

// Мокаем matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
}); 