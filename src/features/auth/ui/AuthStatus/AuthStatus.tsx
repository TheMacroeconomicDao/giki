import React, { useEffect } from 'react';
import { UserAvatar } from '@entities/user';
import { Button } from '@/shared/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/shared/ui/dropdown-menu';
import { Spinner } from '@/shared/ui/spinner';
import { useAuthStore } from '../../model/store';
import { authApi } from '../../api/authApi';
import { usePathname } from 'next/navigation';

interface AuthStatusProps {
  className?: string;
  onLogin?: () => void;
  onLogout?: () => void;
  onProfile?: () => void;
}

/**
 * Компонент статуса аутентификации
 * Отображает текущий статус пользователя и предоставляет действия для аутентификации
 */
export const AuthStatus = ({
  className = '',
  onLogin,
  onLogout,
  onProfile
}: AuthStatusProps) => {
  const { 
    status,
    user,
    loading,
    setStatus,
    setUser,
    setError,
    reset
  } = useAuthStore();

  // Проверка статуса сессии при монтировании компонента
  useEffect(() => {
    const checkSession = async () => {
      try {
        setStatus('loading');
        const response = await authApi.getSession();
        
        if (response.authenticated) {
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Ошибка проверки сессии');
        setStatus('unauthenticated');
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      reset();
      onLogout?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка при выходе');
    }
  };

  // Если статус загружается
  if (status === 'loading' || loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Spinner size="sm" />
        <span className="text-sm">Загрузка...</span>
      </div>
    );
  }

  // Если пользователь аутентифицирован
  if (status === 'authenticated' && user) {
    return (
      <div className={className}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
              <UserAvatar user={user} size="sm" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <p className="text-sm font-medium">{user.name || 'Пользователь'}</p>
                <p className="text-xs text-muted-foreground">{user.email || user.address.slice(0, 8) + '...'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onProfile?.()}>
                Профиль
              </DropdownMenuItem>
              <DropdownMenuItem>
                Настройки
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Если пользователь не аутентифицирован
  return (
    <div className={className}>
      <Button
        onClick={() => onLogin?.()}
      >
        Войти
      </Button>
    </div>
  );
}; 