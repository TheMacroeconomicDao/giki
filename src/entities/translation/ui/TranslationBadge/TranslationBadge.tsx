'use client';

import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { Globe, Bot } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/ui/tooltip';
import { TranslationStatus } from '../../model';

interface TranslationBadgeProps {
  status: TranslationStatus;
  language: string;
  languageName?: string;
  className?: string;
}

export const TranslationBadge: React.FC<TranslationBadgeProps> = ({
  status,
  language,
  languageName,
  className,
}) => {
  // Определяем текст и цвет бейджа в зависимости от статуса
  const badgeConfig = {
    complete: {
      color: 'bg-green-500',
      label: `${languageName || language}`,
      tooltip: `Полный перевод: ${languageName || language}`,
      icon: <Globe className="w-3 h-3 mr-1" />
    },
    partial: {
      color: 'bg-yellow-500',
      label: `${languageName || language} (частично)`,
      tooltip: `Частичный перевод: ${languageName || language}`,
      icon: <Globe className="w-3 h-3 mr-1" />
    },
    machine: {
      color: 'bg-blue-500',
      label: `${languageName || language} (AI)`,
      tooltip: `Машинный перевод: ${languageName || language}`,
      icon: <Bot className="w-3 h-3 mr-1" />
    },
    none: {
      color: 'bg-muted',
      label: `Нет перевода: ${languageName || language}`,
      tooltip: `Перевод отсутствует: ${languageName || language}`,
      icon: <Globe className="w-3 h-3 mr-1" />
    }
  };

  const { color, label, tooltip, icon } = badgeConfig[status];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={cn(color, 'flex items-center gap-1', className)}>
            {icon}
            {label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}; 