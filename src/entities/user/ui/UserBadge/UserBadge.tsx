import React from 'react';
import { Badge } from '@shared/ui/badge';
import { User } from '../../model/types';

interface UserBadgeProps {
  role: User['role'];
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

/**
 * Компонент для отображения роли пользователя в виде бейджа
 * Каждая роль имеет свой стиль оформления
 */
export const UserBadge = ({ role, className = '', variant }: UserBadgeProps) => {
  // Определяем цвет и стиль бейджа в зависимости от роли пользователя
  const getBadgeVariant = (): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (variant) return variant;
    
    switch (role) {
      case 'admin':
        return 'destructive'; // Красный для админа
      case 'editor':
        return 'secondary'; // Фиолетовый/синий для редактора
      case 'viewer':
      default:
        return 'outline'; // Нейтральный для просмотрщика
    }
  };

  // Преобразуем первую букву роли в заглавную для лучшего отображения
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <Badge 
      variant={getBadgeVariant()}
      className={className}
    >
      {formattedRole}
    </Badge>
  );
}; 