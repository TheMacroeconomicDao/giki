'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/shared/ui/sheet';

// Предполагаем, что компонент Sidebar будет реализован в widgets/sidebar
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';

export const MobileMenu: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 pt-10">
        {/* Используем временное решение, пока не реализован компонент Sidebar */}
        <div className="flex flex-col p-4">
          <h2 className="text-lg font-semibold mb-4">Меню</h2>
          <div className="space-y-3">
            <a href="/" className="block py-2 px-3 rounded-md hover:bg-muted">Главная</a>
            <a href="/dashboard" className="block py-2 px-3 rounded-md hover:bg-muted">Дашборд</a>
            <a href="/settings" className="block py-2 px-3 rounded-md hover:bg-muted">Настройки</a>
          </div>
        </div>
        {/* Раскомментировать, когда будет реализован компонент Sidebar */}
        {/* <Sidebar /> */}
      </SheetContent>
    </Sheet>
  );
}; 