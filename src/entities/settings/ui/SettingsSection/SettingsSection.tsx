'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { Separator } from '@/shared/ui/separator';

interface SettingsSectionProps {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  showSeparator?: boolean;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  id,
  title,
  description,
  children,
  className,
  showSeparator = true,
}) => {
  return (
    <div id={id} className={cn('py-6', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
      
      {showSeparator && <Separator className="mt-6" />}
    </div>
  );
}; 