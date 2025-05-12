'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { formatDate } from '@/shared/lib/format';
import { PageWithAuthor } from '../../model';

interface PageCardProps {
  page: PageWithAuthor;
  className?: string;
  onClick?: () => void;
  showAuthor?: boolean;
}

export const PageCard: React.FC<PageCardProps> = ({
  page,
  className,
  onClick,
  showAuthor = true,
}) => {
  // Получаем первые 150 символов контента для предпросмотра
  const contentPreview = page.content.length > 150
    ? `${page.content.slice(0, 150)}...`
    : page.content;
  
  // Определяем цвет бейджа на основе видимости страницы
  const visibilityColor: Record<string, string> = {
    public: 'bg-green-500',
    community: 'bg-blue-500',
    private: 'bg-amber-500',
  };
  
  return (
    <Card 
      className={`hover:shadow-md transition-shadow ${className || ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Link href={`/pages/${page.id}`} className="hover:underline">
            <h3 className="text-xl font-semibold">{page.title}</h3>
          </Link>
          <Badge className={visibilityColor[page.visibility]}>
            {page.visibility}
          </Badge>
        </div>
        {showAuthor && (
          <div className="text-sm text-muted-foreground">
            Автор: {page.author.name || page.author.address.slice(0, 6)}...
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="text-sm line-clamp-3">
          {contentPreview}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 text-xs text-muted-foreground flex justify-between">
        <div>
          {formatDate(page.updated_at)} • {page.views} просмотров
        </div>
      </CardFooter>
    </Card>
  );
}; 