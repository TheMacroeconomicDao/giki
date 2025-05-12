"use client";

import { useMemo } from 'react';
import type { User } from '../../model';

interface UserAvatarProps {
  user: User | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Компонент аватара пользователя
 */
export function UserAvatar({ user, size = 'md', className = '' }: UserAvatarProps) {
  // Размеры аватара
  const dimensions = useMemo(() => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'lg': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  }, [size]);

  // Инициалы пользователя (если нет аватара)
  const initials = useMemo(() => {
    if (!user) return '?';
    if (user.name) {
      return user.name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    // Если нет имени, используем первые символы адреса
    return user.address.substring(2, 4).toUpperCase();
  }, [user]);

  // Если пользователь не загружен или отсутствует
  if (!user) {
    return (
      <div className={`${dimensions} rounded-full bg-gray-300 flex items-center justify-center text-gray-600 ${className}`}>
        ?
      </div>
    );
  }

  // Если у пользователя есть аватар
  if (user.avatar_url) {
    return (
      <img 
        src={user.avatar_url} 
        alt={user.name || user.address.substring(0, 6)}
        className={`${dimensions} rounded-full object-cover ${className}`}
      />
    );
  }

  // Если у пользователя нет аватара, отображаем инициалы
  return (
    <div 
      className={`${dimensions} rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold ${className}`}
    >
      {initials}
    </div>
  );
} 