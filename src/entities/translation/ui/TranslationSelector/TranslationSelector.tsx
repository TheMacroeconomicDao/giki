'use client';

import React, { useMemo } from 'react';
import { Globe, Check } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/shared/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';
import { LanguageInfo } from '../../model';

interface TranslationSelectorProps {
  languages: LanguageInfo[];
  currentLanguage: string | null;
  onLanguageChange: (language: string | null) => void;
  originalLanguageLabel?: string;
  size?: 'sm' | 'default';
  className?: string;
}

export const TranslationSelector: React.FC<TranslationSelectorProps> = ({
  languages,
  currentLanguage,
  onLanguageChange,
  originalLanguageLabel = 'Оригинал',
  size = 'default',
  className,
}) => {
  // Находим информацию о текущем языке
  const currentLanguageInfo = useMemo(() => {
    if (!currentLanguage) return null;
    return languages.find(lang => lang.code === currentLanguage);
  }, [languages, currentLanguage]);
  
  // Делим языки на доступные и недоступные
  const { availableLanguages, unavailableLanguages } = useMemo(() => {
    return languages.reduce(
      (acc, lang) => {
        if (lang.available) {
          acc.availableLanguages.push(lang);
        } else {
          acc.unavailableLanguages.push(lang);
        }
        return acc;
      },
      { availableLanguages: [] as LanguageInfo[], unavailableLanguages: [] as LanguageInfo[] }
    );
  }, [languages]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={size} 
          className={cn(className)}
        >
          <Globe className={cn('mr-2', size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
          {currentLanguageInfo 
            ? `${currentLanguageInfo.name}${currentLanguageInfo.percent ? ` (${currentLanguageInfo.percent}%)` : ''}`
            : originalLanguageLabel
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Язык страницы</DropdownMenuLabel>
        
        <DropdownMenuItem onClick={() => onLanguageChange(null)}>
          {!currentLanguage && <Check className="w-4 h-4 mr-2" />}
          <span className="font-medium">{originalLanguageLabel}</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {availableLanguages.length > 0 && (
          <>
            <DropdownMenuLabel>Доступные переводы</DropdownMenuLabel>
            {availableLanguages.map(lang => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
              >
                {currentLanguage === lang.code && <Check className="w-4 h-4 mr-2" />}
                <span className="flex-1">
                  {lang.name} ({lang.nativeName})
                </span>
                {lang.percent && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {lang.percent}%
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </>
        )}
        
        {unavailableLanguages.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Недоступные переводы</DropdownMenuLabel>
            {unavailableLanguages.map(lang => (
              <DropdownMenuItem
                key={lang.code}
                disabled
                className="opacity-50"
              >
                <span className="flex-1">
                  {lang.name} ({lang.nativeName})
                </span>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 