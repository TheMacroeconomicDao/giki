/**
 * Дополнительные типы для React 19
 */

// Кастомное объявление для JSX namespace
import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      h5: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      // Можно добавить другие HTML-элементы по необходимости
    }
  }
}

// Расширение React namespace
declare module 'react' {
  // Для forwardRef
  export function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
  
  // Типы для ref
  export type ForwardedRef<T> = ((instance: T | null) => void) | React.MutableRefObject<T | null> | null;
}

export {};
