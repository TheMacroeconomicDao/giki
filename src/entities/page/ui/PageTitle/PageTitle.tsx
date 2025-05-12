'use client';

import React from 'react';
import { Button } from '@/shared/ui/button';
import { Share2, FileEdit, Clock, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/shared/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';

interface PageTitleProps {
  title: string;
  className?: string;
  canEdit?: boolean;
  onEdit?: () => void;
  onShare?: () => void;
  onHistory?: () => void;
  onTranslations?: () => void;
}

export const PageTitle: React.FC<PageTitleProps> = ({
  title,
  className,
  canEdit = false,
  onEdit,
  onShare,
  onHistory,
  onTranslations,
}) => {
  return (
    <div className={cn('flex items-center justify-between gap-4 mb-4', className)}>
      <h1 className="text-3xl font-bold tracking-tight">
        {title}
      </h1>
      
      <div className="flex items-center gap-2">
        {canEdit && onEdit && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
          >
            <FileEdit className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onShare && (
              <DropdownMenuItem onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Поделиться
              </DropdownMenuItem>
            )}
            
            {onHistory && (
              <DropdownMenuItem onClick={onHistory}>
                <Clock className="h-4 w-4 mr-2" />
                История версий
              </DropdownMenuItem>
            )}
            
            {onTranslations && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onTranslations}>
                  <Globe className="h-4 w-4 mr-2" />
                  Переводы
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}; 