/// <reference types="vitest/globals" />

import '@testing-library/jest-dom'

declare module '@testing-library/jest-dom' {
  export * from '@testing-library/jest-dom'
}

declare module '@testing-library__jest-dom' {
  export * from '@testing-library/jest-dom'
}

interface CustomMatchers<R = unknown> {
  toBeInTheDocument(): R
  toBeVisible(): R
  toBeEmpty(): R
  toBeDisabled(): R
  toBeEnabled(): R
  toBeInvalid(): R
  toBeRequired(): R
  toBeValid(): R
  toBeChecked(): R
  toBePartiallyChecked(): R
  toContainElement(element: HTMLElement | null): R
  toContainHTML(htmlText: string): R
  toHaveAttribute(attr: string, value?: string): R
  toHaveClass(...classNames: string[]): R
  toHaveFocus(): R
  toHaveFormValues(expectedValues: Record<string, any>): R
  toHaveStyle(css: string | Record<string, any>): R
  toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R
  toHaveValue(value?: string | string[] | number | null): R
  toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R
  toBeEmptyDOMElement(): R
  toHaveAccessibleDescription(expectedAccessibleDescription?: string | RegExp): R
  toHaveAccessibleName(expectedAccessibleName?: string | RegExp): R
  toHaveErrorMessage(expectedError?: string | RegExp): R
  toHaveBeenCalled(): R
  toHaveBeenCalledTimes(times: number): R
  toHaveBeenCalledWith(...args: any[]): R
}

declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}

declare module 'vitest' {
  interface Assertion extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}