'use client';

import React from 'react';
import { formatDate } from '@/shared/lib/format';
import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { VersionWithAuthor } from '../../model';
import { cn } from '@/shared/lib/utils';
import { MessageSquare, Calendar, RotateCcw } from 'lucide-react';

interface VersionInfoProps {
  version: VersionWithAuthor;
  isLatest?: boolean;
  isCurrent?: boolean;
  onRestore?: (versionId: string) => void;
  onComment?: (versionId: string) => void;
  className?: string;
}

export const VersionInfo: React.FC<VersionInfoProps> = ({
  version,
  isLatest = false,
  isCurrent = false,
  onRestore,
  onComment,
  className,
}) => {
  const handleRestore = () => {
    onRestore?.(version.id);
  };
  
  const handleComment = () => {
    onComment?.(version.id);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
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
        
        {onRestore && !isLatest && (
          <Button variant="outline" size="sm" onClick={handleRestore}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Восстановить версию
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Avatar className="h-6 w-6">
            <span className="text-xs">
              {version.author.name ? version.author.name.charAt(0) : version.author.address.charAt(0)}
            </span>
          </Avatar>
          <span>
            {version.author.name || `${version.author.address.slice(0, 6)}...${version.author.address.slice(-4)}`}
          </span>
        </div>
        
        <div className="flex items-center gap-1 ml-3">
          <Calendar className="h-4 w-4" />
          <time dateTime={version.created_at}>
            {new Date(version.created_at).toLocaleString()}
          </time>
        </div>
      </div>
      
      {version.comment ? (
        <div className="bg-muted p-3 rounded flex items-start gap-2 text-sm">
          <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p className="text-muted-foreground">{version.comment}</p>
        </div>
      ) : onComment ? (
        <Button 
          variant="ghost" 
          size="sm" 
          className="self-start text-muted-foreground"
          onClick={handleComment}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Добавить комментарий
        </Button>
      ) : null}
    </div>
  );
}; 