'use client';

import React from 'react';
import { formatDate } from '@/shared/lib/format';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { VersionWithAuthor } from '../../model';
import { Clock, RotateCcw, GitCompare, MessageSquare } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Avatar } from '@/shared/ui/avatar';

interface VersionCardProps {
  version: VersionWithAuthor;
  isLatest?: boolean;
  isCurrent?: boolean;
  onRestore?: (versionId: string) => void;
  onCompare?: (versionId: string) => void;
  onView?: (versionId: string) => void;
  className?: string;
}

export const VersionCard: React.FC<VersionCardProps> = ({
  version,
  isLatest = false,
  isCurrent = false,
  onRestore,
  onCompare,
  onView,
  className,
}) => {
  const handleView = () => {
    onView?.(version.id);
  };
  
  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRestore?.(version.id);
  };
  
  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCompare?.(version.id);
  };

  return (
    <Card 
      className={cn(
        'hover:shadow-md transition-shadow cursor-pointer',
        isCurrent && 'border-primary border-2',
        className
      )}
      onClick={handleView}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="font-medium text-lg">
              Версия {version.version_number}
            </span>
            {isLatest && (
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-0.5 rounded">
                Последняя
              </span>
            )}
            {isCurrent && (
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded">
                Текущая
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <h3 className="font-medium mb-1">{version.title}</h3>
        
        {version.comment && (
          <div className="mt-2 text-sm bg-muted p-2 rounded flex items-start gap-2">
            <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">{version.comment}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Avatar className="h-5 w-5">
            <span className="text-[10px]">
              {version.author.name ? version.author.name.charAt(0) : version.author.address.charAt(0)}
            </span>
          </Avatar>
          <span>
            {version.author.name || `${version.author.address.slice(0, 6)}...`}
          </span>
          <Clock className="h-3.5 w-3.5 ml-2 mr-1" />
          {formatDate(version.created_at)}
        </div>
        
        <div className="flex gap-1">
          {onCompare && (
            <Button variant="ghost" size="sm" onClick={handleCompare} className="h-7">
              <GitCompare className="h-3.5 w-3.5 mr-1" />
              Сравнить
            </Button>
          )}
          {onRestore && !isLatest && (
            <Button variant="ghost" size="sm" onClick={handleRestore} className="h-7">
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Восстановить
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}; 