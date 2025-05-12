"use client";

import { UserAvatar } from '../UserAvatar';
import type { User } from '../../model';

interface UserInfoProps {
  user: User | null | undefined;
  showAddress?: boolean;
  showRole?: boolean;
  className?: string;
}

/**
 * Компонент отображения информации о пользователе
 */
export function UserInfo({ 
  user, 
  showAddress = true, 
  showRole = false, 
  className = '' 
}: UserInfoProps) {
  if (!user) {
    return (
      <div className={`flex items-center opacity-70 ${className}`}>
        <UserAvatar user={null} size="sm" />
        <div className="ml-2">
          <div className="text-sm font-medium">Пользователь не найден</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <UserAvatar user={user} size="sm" />
      <div className="ml-2">
        <div className="text-sm font-medium">
          {user.name || `Пользователь ${user.address.substring(0, 6)}...${user.address.substring(user.address.length - 4)}`}
        </div>
        
        {showAddress && (
          <div className="text-xs text-gray-500">
            {user.address.substring(0, 6)}...{user.address.substring(user.address.length - 4)}
          </div>
        )}
        
        {showRole && (
          <div className="text-xs font-medium mt-0.5">
            {user.role === 'admin' && <span className="text-red-600">Администратор</span>}
            {user.role === 'editor' && <span className="text-blue-600">Редактор</span>}
            {user.role === 'viewer' && <span className="text-green-600">Читатель</span>}
          </div>
        )}
      </div>
    </div>
  );
} 