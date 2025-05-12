'use client';

import React, { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

interface SettingsCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  icon,
  children,
  className,
}) => {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}; 