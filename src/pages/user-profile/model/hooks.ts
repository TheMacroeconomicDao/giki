import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/shared/ui/use-toast';
import { useAuthStore } from '@/features/auth';
import { getUserById, getUserStats, followUser, unfollowUser } from '@/entities/user';
import { UserProfileState, UserStats } from './types';

/**
 * Хук для управления состоянием страницы профиля пользователя
 */
export const useUserProfile = (userId?: string): [
  UserProfileState,
  {
    toggleFollow: () => Promise<void>;
    getUserStats: () => Promise<UserStats>;
  }
] => {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [state, setState] = useState<UserProfileState>({
    loading: true,
    error: null,
    user: null,
    isCurrentUser: false,
    isFollowing: false,
  });

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        
        const targetUserId = userId || currentUser?.id;
        
        if (!targetUserId) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Пользователь не найден'
          }));
          return;
        }
        
        const user = await getUserById(targetUserId);
        
        if (user) {
          const isCurrentUser = currentUser?.id === user.id;
          const isFollowing = currentUser ? Boolean(user.followers?.includes(currentUser.id)) : false;
          
          setState(prev => ({
            ...prev,
            user,
            isCurrentUser,
            isFollowing,
            loading: false,
            error: null
          }));
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Пользователь не найден'
          }));
        }
      } catch (error) {
        console.error('Ошибка загрузки пользователя:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Ошибка загрузки данных пользователя'
        }));
        
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить данные пользователя',
          variant: 'destructive',
        });
      }
    };

    fetchUser();
  }, [userId, currentUser]);

  // Переключение подписки на пользователя
  const toggleFollow = useCallback(async () => {
    if (!state.user || state.isCurrentUser || !currentUser) {
      return;
    }
    
    try {
      if (state.isFollowing) {
        await unfollowUser(state.user.id);
        setState(prev => ({ ...prev, isFollowing: false }));
        toast({
          title: 'Отписка',
          description: `Вы больше не подписаны на ${state.user?.name || 'пользователя'}`,
        });
      } else {
        await followUser(state.user.id);
        setState(prev => ({ ...prev, isFollowing: true }));
        toast({
          title: 'Подписка',
          description: `Вы подписались на ${state.user?.name || 'пользователя'}`,
        });
      }
    } catch (error) {
      console.error('Ошибка при изменении подписки:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить подписку',
        variant: 'destructive',
      });
    }
  }, [state.user, state.isCurrentUser, state.isFollowing, currentUser]);

  // Получение статистики пользователя
  const getStats = useCallback(async (): Promise<UserStats> => {
    if (!state.user) {
      return {
        pagesCreated: 0,
        pagesEdited: 0,
        followers: 0,
        following: 0,
        reputation: 0,
      };
    }
    
    try {
      const stats = await getUserStats(state.user.id);
      return stats;
    } catch (error) {
      console.error('Ошибка при загрузке статистики:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить статистику пользователя',
        variant: 'destructive',
      });
      
      return {
        pagesCreated: 0,
        pagesEdited: 0,
        followers: 0,
        following: 0,
        reputation: 0,
      };
    }
  }, [state.user]);

  return [
    state,
    {
      toggleFollow,
      getUserStats: getStats,
    }
  ];
}; 