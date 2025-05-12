'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from './theme';
// Позже мы добавим другие провайдеры, такие как AuthProvider и др.

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Композитный провайдер, объединяющий все провайдеры приложения
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ThemeProvider>
      {/* Другие провайдеры будут добавлены сюда */}
      {children}
    </ThemeProvider>
  );
}; 