'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/entities/settings';
import { settingsApi } from '@/entities/settings/api';
import { useAuthStore } from '@/features/auth';

/**
 * Провайдер настроек
 * Отвечает за загрузку системных и пользовательских настроек
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { 
    setSystemSettings,
    setUserSettings, 
    setLoading, 
    setError 
  } = useSettingsStore();
  
  const { user, status } = useAuthStore();

  // Загрузка системных настроек при инициализации
  useEffect(() => {
    const loadSystemSettings = async () => {
      try {
        setLoading(true);
        const systemSettings = await settingsApi.getSystemSettings();
        setSystemSettings(systemSettings);
      } catch (error) {
        console.error('Error loading system settings:', error);
        setError(error instanceof Error ? error.message : 'Ошибка загрузки системных настроек');
      } finally {
        setLoading(false);
      }
    };

    loadSystemSettings();
  }, [setSystemSettings, setLoading, setError]);

  // Загрузка пользовательских настроек при аутентификации
  useEffect(() => {
    if (status === 'authenticated' && user) {
      const loadUserSettings = async () => {
        try {
          setLoading(true);
          const userSettings = await settingsApi.getUserSettings(user.id);
          setUserSettings(userSettings);
        } catch (error) {
          console.error('Error loading user settings:', error);
          setError(error instanceof Error ? error.message : 'Ошибка загрузки пользовательских настроек');
        } finally {
          setLoading(false);
        }
      };

      loadUserSettings();
    } else if (status === 'unauthenticated') {
      // Очищаем пользовательские настройки при выходе
      setUserSettings(null);
    }
  }, [status, user, setUserSettings, setLoading, setError]);

  return <>{children}</>;
} 