import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Произошла ошибка в компоненте:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-50">
          <div className="max-w-md p-6 bg-white border rounded-lg shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-red-600">Что-то пошло не так</h2>
            <p className="mb-4 text-gray-700">
              В интерфейсе произошла ошибка. Попробуйте обновить страницу.
            </p>
            <pre className="p-3 mb-4 overflow-auto text-sm bg-gray-100 rounded">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Обновить страницу
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
