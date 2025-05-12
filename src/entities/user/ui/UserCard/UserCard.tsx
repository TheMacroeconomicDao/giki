import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@shared/ui/card';
import { User } from '../../model/types';
import { UserAvatar } from '../UserAvatar';
import { UserBadge } from '../UserBadge';
import { Button } from '@shared/ui/button';

interface UserCardProps {
  user: User;
  className?: string;
  actions?: React.ReactNode;
  showControls?: boolean;
  onEdit?: (user: User) => void;
  onView?: (user: User) => void;
}

/**
 * Компонент карточки пользователя
 * Отображает основную информацию о пользователе в виде карточки
 */
export const UserCard = ({
  user,
  className = '',
  actions,
  showControls = false,
  onEdit,
  onView,
}: UserCardProps) => {
  const handleEdit = () => {
    if (onEdit) onEdit(user);
  };

  const handleView = () => {
    if (onView) onView(user);
  };

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <UserAvatar 
          user={user}
          size="lg"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">{user.name || 'Без имени'}</h3>
            <UserBadge role={user.role} />
          </div>
          {user.email && (
            <p className="text-sm text-muted-foreground">{user.email}</p>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="text-sm">
          <p className="text-muted-foreground truncate">
            Адрес: {user.address}
          </p>
          <p className="text-muted-foreground">
            Регистрация: {new Date(user.created_at).toLocaleDateString()}
          </p>
          {user.last_login && (
            <p className="text-muted-foreground">
              Последний вход: {new Date(user.last_login).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardContent>
      
      {(showControls || actions) && (
        <CardFooter className="flex justify-end gap-2 pt-2">
          {actions}
          {showControls && (
            <>
              {onView && (
                <Button variant="outline" size="sm" onClick={handleView}>
                  Просмотр
                </Button>
              )}
              {onEdit && (
                <Button variant="default" size="sm" onClick={handleEdit}>
                  Редактировать
                </Button>
              )}
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
}; 