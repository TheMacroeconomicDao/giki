'use client';

import React from 'react';
import { formatDate } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Avatar } from '@/shared/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { PageWithDetails } from '../../model';

interface PageInfoProps {
  page: PageWithDetails;
  className?: string;
}

export const PageInfo: React.FC<PageInfoProps> = ({ 
  page,
  className = '',
}) => {
  // Определяем цвет бейджа на основе видимости страницы
  const visibilityColor: Record<string, string> = {
    public: 'bg-green-500',
    community: 'bg-blue-500',
    private: 'bg-amber-500',
  };
  
  // Форматируем число переводов
  const translationsCount = page.translations.length;
  
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <span className="text-xs">
              {page.author.name ? page.author.name.charAt(0) : page.author.address.charAt(0)}
            </span>
          </Avatar>
          
          <div className="flex flex-col">
            <span className="font-medium">
              {page.author.name || `${page.author.address.slice(0, 6)}...${page.author.address.slice(-4)}`}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(page.created_at)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Создано: {new Date(page.created_at).toLocaleString()}</p>
                  <p>Обновлено: {new Date(page.updated_at).toLocaleString()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <Badge className={visibilityColor[page.visibility]}>
          {page.visibility}
        </Badge>
      </div>
      
      <div className="flex gap-3 text-sm text-muted-foreground mt-1">
        <div>
          <span className="font-medium">{page.views}</span> просмотров
        </div>
        <div>
          <span className="font-medium">{page.version_count}</span> {page.version_count === 1 ? 'версия' : 
            page.version_count > 1 && page.version_count < 5 ? 'версии' : 'версий'}
        </div>
        {translationsCount > 0 && (
          <div>
            <span className="font-medium">{translationsCount}</span> {translationsCount === 1 ? 'перевод' : 
              translationsCount > 1 && translationsCount < 5 ? 'перевода' : 'переводов'}
          </div>
        )}
      </div>
    </div>
  );
}; 