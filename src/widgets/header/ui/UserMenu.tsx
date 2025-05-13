'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown, Settings, User } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

import { useAuth } from '@/features/auth';
import { UserAvatar } from '@/entities/user/ui';

export const UserMenu: React.FC = () => {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  const handleConnect = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const shortenAddress = (addr: string) => {
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';
  };

  if (!isAuthenticated) {
    return (
      <Button onClick={handleConnect} disabled={isLoading}>
        {isLoading ? "Подключение..." : "Подключить кошелек"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <UserAvatar 
            user={user} 
            className="h-8 w-8" 
          />
          <span className="hidden md:inline-flex">
            {user?.name || shortenAddress(user?.address || '')}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <User className="mr-2 h-4 w-4" />
            Дашборд
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Настройки
          </Link>
        </DropdownMenuItem>
        {user?.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Settings className="mr-2 h-4 w-4" />
              Админ панель
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect}>
          Отключить кошелек
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 