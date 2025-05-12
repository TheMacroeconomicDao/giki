'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Bell, 
  ChevronDown, 
  Menu, 
  Moon, 
  Search, 
  Settings, 
  Sun, 
  User
} from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/shared/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

// Сущности и функциональности
import { useAuth } from '@/features/auth'; // AuthProvider из нового слоя providers
import { UserAvatar } from '@/entities/user';
import { ThemeSwitcher } from './ThemeSwitcher';
import { HeaderSearch } from './HeaderSearch';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';

export const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="border-b sticky top-0 z-30 bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Мобильное меню */}
        <MobileMenu />

        {/* Логотип */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/" className="font-bold text-xl">
            Giki.js
          </Link>
        </div>

        {/* Поиск */}
        <HeaderSearch 
          isOpen={searchOpen}
          query={searchQuery} 
          onChange={setSearchQuery}
          onSubmit={handleSearch}
        />

        <div className="flex items-center gap-2">
          {/* Кнопка поиска на мобильных */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Поиск</span>
          </Button>

          {/* Переключатель темы */}
          <ThemeSwitcher />

          {/* Уведомления */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Уведомления</span>
          </Button>

          {/* Меню пользователя */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}; 