'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/shared/ui/sheet';

// Импортируем реализованный компонент Sidebar
import { Sidebar } from '@/widgets/sidebar';

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
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}; 