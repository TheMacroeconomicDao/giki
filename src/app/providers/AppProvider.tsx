'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from './theme';
import { AuthProvider } from './auth';
import { SettingsProvider } from './settings';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Композитный провайдер, объединяющий все провайдеры приложения
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}; 