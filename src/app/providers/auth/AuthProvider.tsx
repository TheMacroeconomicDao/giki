"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth';
import { userApi } from '@/entities/user';
import { authApi } from '@/features/auth/api';

/**
 * Провайдер аутентификации
 * Отвечает за проверку сессии и загрузку текущего пользователя
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { status, setStatus, setUser, setLoading, setError } = useAuthStore();

  // Проверка сессии при загрузке приложения
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        setStatus('loading');
        
        // Проверяем сессию
        const { authenticated } = await authApi.getSession();
        
        if (authenticated) {
          // Если пользователь аутентифицирован, загружаем его данные
          const user = await userApi.getCurrentUser();
          setUser(user);
          setStatus('authenticated');
        } else {
          // Если нет сессии, очищаем состояние
          setStatus('unauthenticated');
          setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setStatus('unauthenticated');
        setError(error instanceof Error ? error.message : 'Ошибка проверки сессии');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [setStatus, setUser, setLoading, setError]);

  return <>{children}</>;
} 