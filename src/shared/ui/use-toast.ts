/**
 * Хук для работы с уведомлениями (FSD)
 */
import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface UseToastReturn {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

/**
 * Хук для управления всплывающими уведомлениями
 */
export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    const toast: Toast = {
      id,
      message,
      type,
      duration
    };
    
    setToasts((prevToasts) => [...prevToasts, toast]);
    
    // Автоматическое удаление по истечении duration
    if (duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    removeToast
  };
};

// Вспомогательные функции для удобства
export const toast = {
  success: (message: string, duration?: number) => ({ message, type: 'success' as ToastType, duration }),
  error: (message: string, duration?: number) => ({ message, type: 'error' as ToastType, duration }),
  warning: (message: string, duration?: number) => ({ message, type: 'warning' as ToastType, duration }),
  info: (message: string, duration?: number) => ({ message, type: 'info' as ToastType, duration })
}; 