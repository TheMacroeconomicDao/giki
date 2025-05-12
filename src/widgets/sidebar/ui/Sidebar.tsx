'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Search, 
  BookOpen,
  ChevronDown,
  PlusCircle,
  History
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
  isCollapsible?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  title,
  isActive = false,
  isCollapsible = false,
  isOpen = false,
  onToggle,
  children
}) => {
  return (
    <li className="mb-1">
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
          isActive 
            ? "bg-primary/10 text-primary font-medium" 
            : "hover:bg-muted"
        )}
        onClick={isCollapsible ? (e) => {
          e.preventDefault();
          onToggle?.();
        } : undefined}
      >
        <span className="w-5 h-5 flex items-center justify-center">
          {icon}
        </span>
        <span className="flex-1">{title}</span>
        {isCollapsible && (
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform", 
              isOpen ? "transform rotate-180" : ""
            )} 
          />
        )}
      </Link>
      {isCollapsible && isOpen && children && (
        <ul className="pl-8 mt-1 space-y-1">
          {children}
        </ul>
      )}
    </li>
  );
};

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [recentPagesOpen, setRecentPagesOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  
  return (
    <div className="flex flex-col w-full h-full bg-background border-r p-4">
      <div className="flex items-center h-12 mb-6">
        <h2 className="font-bold text-xl">Giki.js</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-xs uppercase text-muted-foreground font-medium mb-2 px-3">
            Навигация
          </h3>
          <ul className="space-y-1">
            <NavItem 
              href="/" 
              icon={<Home className="h-4 w-4" />} 
              title="Главная"
              isActive={pathname === '/'}
            />
            <NavItem 
              href="/dashboard" 
              icon={<LayoutDashboard className="h-4 w-4" />} 
              title="Дашборд"
              isActive={pathname === '/dashboard'}
            />
            <NavItem 
              href="/search" 
              icon={<Search className="h-4 w-4" />} 
              title="Поиск"
              isActive={pathname.startsWith('/search')}
            />
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xs uppercase text-muted-foreground font-medium mb-2 px-3">
            Страницы
          </h3>
          <ul className="space-y-1">
            <NavItem 
              href="/pages" 
              icon={<BookOpen className="h-4 w-4" />} 
              title="Все страницы"
              isActive={pathname === '/pages'}
            />
            <NavItem 
              href="#" 
              icon={<History className="h-4 w-4" />} 
              title="Недавние страницы"
              isCollapsible
              isOpen={recentPagesOpen}
              onToggle={() => setRecentPagesOpen(!recentPagesOpen)}
            >
              {/* В будущем здесь будет динамический список недавних страниц пользователя */}
              <li>
                <Link 
                  href="/pages/example-1" 
                  className="flex items-center py-1 px-2 text-sm rounded-md hover:bg-muted"
                >
                  Пример страницы 1
                </Link>
              </li>
              <li>
                <Link 
                  href="/pages/example-2" 
                  className="flex items-center py-1 px-2 text-sm rounded-md hover:bg-muted"
                >
                  Пример страницы 2
                </Link>
              </li>
            </NavItem>
            <NavItem 
              href="/create" 
              icon={<PlusCircle className="h-4 w-4" />} 
              title="Создать страницу"
              isActive={pathname === '/create'}
            />
          </ul>
        </div>
        
        <div>
          <h3 className="text-xs uppercase text-muted-foreground font-medium mb-2 px-3">
            Система
          </h3>
          <ul className="space-y-1">
            <NavItem 
              href="/settings" 
              icon={<Settings className="h-4 w-4" />} 
              title="Настройки"
              isActive={pathname.startsWith('/settings')}
            />
          </ul>
        </div>
      </nav>
      
      <div className="border-t pt-4 mt-6">
        <div className="px-3 py-2 text-xs text-muted-foreground">
          Версия 1.0.0
        </div>
      </div>
    </div>
  );
}; 