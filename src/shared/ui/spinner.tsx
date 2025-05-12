import * as React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * Компонент загрузки, используемый для индикации выполнения асинхронных операций
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      xs: 'h-3 w-3 border-[1.5px]',
      sm: 'h-4 w-4 border-[1.5px]',
      md: 'h-6 w-6 border-2',
      lg: 'h-8 w-8 border-[3px]',
    };

    return (
      <div
        className={cn(
          'inline-block animate-spin rounded-full border-current border-b-transparent',
          sizeClasses[size],
          className
        )}
        ref={ref}
        role="status"
        aria-label="loading"
        {...props}
      >
        <span className="sr-only">Загрузка...</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner'; 