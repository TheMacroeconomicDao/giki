'use client';

import React from 'react';
import { VersionDiffItem, VersionDiffResult } from '../../model';
import { cn } from '@/shared/lib/utils';

interface VersionDiffProps {
  diffResult: VersionDiffResult;
  className?: string;
}

export const VersionDiff: React.FC<VersionDiffProps> = ({
  diffResult,
  className,
}) => {
  // Функция для отображения различий с учетом типа изменения
  const renderDiffItems = (items: VersionDiffItem[], type: 'title' | 'content') => {
    if (!items.length) return null;
    
    return items.map((item, index) => {
      // Определяем стили для различных типов изменений
      const styles = {
        added: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-l-4 border-green-500',
        removed: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-l-4 border-red-500',
        unchanged: '',
      };
      
      // Для контента делим строки и обрабатываем каждую отдельно
      if (type === 'content' && item.value.includes('\n')) {
        const lines = item.value.split('\n');
        
        return (
          <React.Fragment key={index}>
            {lines.map((line, lineIndex) => (
              <div 
                key={`${index}-${lineIndex}`} 
                className={cn(
                  'px-3 py-0.5', 
                  styles[item.type]
                )}
              >
                {line || ' '}  {/* Пустая строка отображается как пробел */}
              </div>
            ))}
          </React.Fragment>
        );
      }
      
      // Для заголовка или одиночной строки контента
      return (
        <div 
          key={index} 
          className={cn(
            'px-3 py-1',
            type === 'title' ? 'text-lg font-medium' : '',
            styles[item.type]
          )}
        >
          {item.value}
        </div>
      );
    });
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">Изменения в заголовке:</h3>
        <div className="border rounded overflow-hidden bg-card">
          {renderDiffItems(diffResult.diffs.title, 'title')}
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">Изменения в содержимом:</h3>
        <div className="border rounded overflow-hidden bg-card font-mono text-sm whitespace-pre-wrap">
          {renderDiffItems(diffResult.diffs.content, 'content')}
        </div>
      </div>
      
      <div className="flex gap-2 text-xs text-muted-foreground">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>Добавлено</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
          <span>Удалено</span>
        </div>
      </div>
    </div>
  );
}; 