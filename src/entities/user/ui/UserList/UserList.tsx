import React, { useState, useMemo } from 'react';
import { User } from '@entities/user';
import { UserCard } from '../UserCard';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

interface UserListProps {
  users: User[];
  className?: string;
  onUserEdit?: (user: User) => void;
  onUserView?: (user: User) => void;
  showControls?: boolean;
}

/**
 * Компонент списка пользователей с фильтрацией и сортировкой
 */
export const UserList = ({
  users,
  className = '',
  onUserEdit,
  onUserView,
  showControls = false
}: UserListProps) => {
  // Состояние для поиска и фильтрации
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'last_login'>('name');

  // Фильтрация и сортировка пользователей
  const filteredUsers = useMemo(() => {
    return users
      .filter(user => {
        // Фильтр по поисковому запросу
        const matchesSearch = !searchQuery || 
          (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
          (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          user.address.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Фильтр по роли
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        
        return matchesSearch && matchesRole;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return (a.name || '').localeCompare(b.name || '');
          case 'created_at':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'last_login':
            if (!a.last_login) return 1;
            if (!b.last_login) return -1;
            return new Date(b.last_login).getTime() - new Date(a.last_login).getTime();
          default:
            return 0;
        }
      });
  }, [users, searchQuery, roleFilter, sortBy]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        {/* Строка поиска */}
        <div className="flex-grow">
          <Input
            placeholder="Поиск пользователей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          {/* Фильтр по ролям */}
          <Select
            value={roleFilter}
            onValueChange={setRoleFilter}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Роль" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все роли</SelectItem>
              <SelectItem value="admin">Администратор</SelectItem>
              <SelectItem value="editor">Редактор</SelectItem>
              <SelectItem value="viewer">Просмотрщик</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Сортировка */}
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as typeof sortBy)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">По имени</SelectItem>
              <SelectItem value="created_at">По дате регистрации</SelectItem>
              <SelectItem value="last_login">По последнему входу</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Отображение результатов */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              showControls={showControls}
              onEdit={onUserEdit}
              onView={onUserView}
            />
          ))
        ) : (
          <p className="text-muted-foreground col-span-2 text-center py-8">
            Пользователи не найдены
          </p>
        )}
      </div>
      
      <div className="text-sm text-muted-foreground text-right">
        Всего пользователей: {filteredUsers.length}
      </div>
    </div>
  );
}; 