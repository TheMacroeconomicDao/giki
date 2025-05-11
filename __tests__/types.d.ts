declare module '@testing-library/react' {
  export function render(
    ui: React.ReactElement,
    options?: any
  ): {
    container: HTMLElement;
    baseElement: HTMLElement;
    debug: (baseElement?: HTMLElement) => void;
    rerender: (ui: React.ReactElement) => void;
    unmount: () => void;
    asFragment: () => DocumentFragment;
    findByLabelText: any;
    findAllByLabelText: any;
    getByLabelText: any;
    getAllByLabelText: any;
    queryByLabelText: any;
    queryAllByLabelText: any;
    findByPlaceholderText: any;
    findAllByPlaceholderText: any;
    getByPlaceholderText: any;
    getAllByPlaceholderText: any;
    queryByPlaceholderText: any;
    queryAllByPlaceholderText: any;
    findByText: any;
    findAllByText: any;
    getByText: any;
    getAllByText: any;
    queryByText: any;
    queryAllByText: any;
    findByAltText: any;
    findAllByAltText: any;
    getByAltText: any;
    getAllByAltText: any;
    queryByAltText: any;
    queryAllByAltText: any;
    findByTitle: any;
    findAllByTitle: any;
    getByTitle: any;
    getAllByTitle: any;
    queryByTitle: any;
    queryAllByTitle: any;
    findByDisplayValue: any;
    findAllByDisplayValue: any;
    getByDisplayValue: any;
    getAllByDisplayValue: any;
    queryByDisplayValue: any;
    queryAllByDisplayValue: any;
    findByRole: any;
    findAllByRole: any;
    getByRole: any;
    getAllByRole: any;
    queryByRole: any;
    queryAllByRole: any;
    findByTestId: any;
    findAllByTestId: any;
    getByTestId: any;
    getAllByTestId: any;
    queryByTestId: any;
    queryAllByTestId: any;
  };

  export type RenderResult = ReturnType<typeof render>;

  export const screen: {
    getByLabelText: any;
    getAllByLabelText: any;
    queryByLabelText: any;
    queryAllByLabelText: any;
    getByPlaceholderText: any;
    getAllByPlaceholderText: any;
    queryByPlaceholderText: any;
    queryAllByPlaceholderText: any;
    getByText: any;
    getAllByText: any;
    queryByText: any;
    queryAllByText: any;
    getByAltText: any;
    getAllByAltText: any;
    queryByAltText: any;
    queryAllByAltText: any;
    getByTitle: any;
    getAllByTitle: any;
    queryByTitle: any;
    queryAllByTitle: any;
    getByDisplayValue: any;
    getAllByDisplayValue: any;
    queryByDisplayValue: any;
    queryAllByDisplayValue: any;
    getByRole: any;
    getAllByRole: any;
    queryByRole: any;
    queryAllByRole: any;
    getByTestId: any;
    getAllByTestId: any;
    queryByTestId: any;
    queryAllByTestId: any;
  };

  export function fireEvent(element: HTMLElement, event: Event): void;
  export const fireEvent: {
    click: any;
    change: any;
    focus: any;
    blur: any;
    keyDown: any;
    keyPress: any;
    keyUp: any;
    mouseDown: any;
    mouseEnter: any;
    mouseLeave: any;
    mouseMove: any;
    mouseOut: any;
    mouseOver: any;
    mouseUp: any;
    select: any;
  };

  export function waitFor<T>(
    callback: () => T | Promise<T>,
    options?: {
      container?: HTMLElement;
      timeout?: number;
      interval?: number;
      onTimeout?: (error: Error) => Error;
      mutationObserverOptions?: MutationObserverInit;
    }
  ): Promise<T>;
}

declare module '@testing-library/user-event' {
  const userEvent: {
    click: (element: HTMLElement | SVGElement) => Promise<void>;
    type: (element: HTMLElement, text: string, options?: any) => Promise<void>;
    upload: (element: HTMLElement, file: File | File[], options?: any) => Promise<void>;
    clear: (element: HTMLElement) => Promise<void>;
    selectOptions: (element: HTMLElement, values: string | string[]) => Promise<void>;
    deselectOptions: (element: HTMLElement, values: string | string[]) => Promise<void>;
    keyboard: any;
    setup: (options?: any) => any;
  };
  export default userEvent;
}

interface CustomMatchers<R = unknown> {
  toBeInTheDocument(): R;
  toHaveValue(value: string | string[] | number | null): R;
  toHaveBeenCalledWith(...args: any[]): R;
  toHaveBeenCalled(): R;
}

declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
  
  namespace Chai {
    interface Assertion extends CustomMatchers {}
    interface AsyncAssertion extends CustomMatchers {}
  }

  // Добавляем any типы, которые могут быть использованы в тестах
  interface ExpectStatic {
    any: (constructor: any) => any;
    objectContaining: (obj: any) => any;
  }
}

declare module 'vitest' {
  interface Assertion extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
} 