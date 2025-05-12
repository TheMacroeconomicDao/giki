'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/shared/ui/input';

interface HeaderSearchProps {
  isOpen: boolean;
  query: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  isOpen,
  query,
  onChange,
  onSubmit,
}) => {
  return (
    <div className={`${isOpen ? 'flex' : 'hidden md:flex'} flex-1 items-center mx-4`}>
      <form className="w-full" onSubmit={onSubmit}>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск страниц..."
            className="w-full pl-8 md:w-[300px] lg:w-[400px]"
            value={query}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
}; 