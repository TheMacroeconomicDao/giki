'use client';

import React from 'react';
import { Eye, History, Languages } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { formatDate } from '@/shared/lib/format';

interface PageStatsProps {
  views: number;
  versionCount: number;
  translationCount: number;
  updatedAt: string;
  className?: string;
}

export const PageStats: React.FC<PageStatsProps> = ({
  views,
  versionCount,
  translationCount,
  updatedAt,
  className,
}) => {
  return (
    <div className={cn('flex flex-wrap gap-4 text-muted-foreground text-sm', className)}>
      <div className="flex items-center gap-1">
        <Eye className="h-4 w-4" />
        <span>
          {views} просмотр{views === 1 ? '' : views > 1 && views < 5 ? 'а' : 'ов'}
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        <History className="h-4 w-4" />
        <span>
          {versionCount} верси{versionCount === 1 ? 'я' : versionCount > 1 && versionCount < 5 ? 'и' : 'й'}
        </span>
      </div>
      
      {translationCount > 0 && (
        <div className="flex items-center gap-1">
          <Languages className="h-4 w-4" />
          <span>
            {translationCount} перевод{translationCount === 1 ? '' : translationCount > 1 && translationCount < 5 ? 'а' : 'ов'}
          </span>
        </div>
      )}
      
      <div className="flex-grow text-right">
        Обновлено: {formatDate(updatedAt)}
      </div>
    </div>
  );
}; 