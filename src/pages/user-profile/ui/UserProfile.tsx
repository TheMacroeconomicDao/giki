'use client';

import { useState, useEffect } from 'react';
import { UserCircle, Mail, Calendar, MapPin, Link2, Users, FileText, Edit, Award, UserPlus, UserMinus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { PageCard } from '@/entities/page';
import { useUserProfile } from '../model/hooks';
import { UserProfileProps, UserStats } from '../model/types';

/**
 * Компонент страницы профиля пользователя
 */
export const UserProfile = ({ userId }: UserProfileProps) => {
  const [
    { user, loading, error, isCurrentUser, isFollowing },
    { toggleFollow, getUserStats }
  ] = useUserProfile(userId);
  
  const [activeTab, setActiveTab] = useState<string>('pages');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Загрузка статистики пользователя
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      setLoadingStats(true);
      const userStats = await getUserStats();
      setStats(userStats);
      setLoadingStats(false);
    };
    
    fetchStats();
  }, [user, getUserStats]);

  // Отображение загрузки
  if (loading) {
    return (
      <div className="container mx-auto py-10 max-w-5xl">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  // Отображение ошибки
  if (error || !user) {
    return (
      <div className="container mx-auto py-10 max-w-5xl">
        <Alert variant="destructive">
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error || 'Пользователь не найден'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-5xl">
      <div className="space-y-8">
        {/* Шапка профиля */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.avatarUrl || ''} alt={user.name || ''} />
              <AvatarFallback className="text-3xl">
                {user.name?.slice(0, 2).toUpperCase() || <UserCircle className="h-16 w-16" />}
              </AvatarFallback>
            </Avatar>
            {user.role === 'admin' && (
              <Badge className="absolute bottom-0 right-0 px-2 py-1" variant="destructive">
                Админ
              </Badge>
            )}
            {user.role === 'editor' && (
              <Badge className="absolute bottom-0 right-0 px-2 py-1" variant="secondary">
                Редактор
              </Badge>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{user.name || 'Пользователь'}</h1>
                <p className="text-muted-foreground">
                  {user.address?.slice(0, 6)}...{user.address?.slice(-4)}
                </p>
              </div>
              
              <div className="flex gap-2">
                {isCurrentUser ? (
                  <Button variant="outline" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Редактировать профиль
                  </Button>
                ) : (
                  <Button 
                    variant={isFollowing ? "outline" : "default"} 
                    onClick={toggleFollow}
                    className="gap-2"
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="h-4 w-4" />
                        Отписаться
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Подписаться
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            <p className="text-lg">{user.bio || 'Нет информации о пользователе'}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {user.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-1">
                  <Link2 className="h-4 w-4" />
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {user.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {user.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Присоединился {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-center flex flex-col items-center">
                <FileText className="h-5 w-5 mb-1" />
                <span>Страниц создано</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-2xl font-bold">
              {loadingStats ? <Skeleton className="h-8 w-12 mx-auto" /> : stats?.pagesCreated || 0}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-center flex flex-col items-center">
                <Edit className="h-5 w-5 mb-1" />
                <span>Страниц отредактировано</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-2xl font-bold">
              {loadingStats ? <Skeleton className="h-8 w-12 mx-auto" /> : stats?.pagesEdited || 0}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-center flex flex-col items-center">
                <Users className="h-5 w-5 mb-1" />
                <span>Подписчиков</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-2xl font-bold">
              {loadingStats ? <Skeleton className="h-8 w-12 mx-auto" /> : stats?.followers || 0}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-center flex flex-col items-center">
                <Award className="h-5 w-5 mb-1" />
                <span>Репутация</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-2xl font-bold">
              {loadingStats ? <Skeleton className="h-8 w-12 mx-auto" /> : stats?.reputation || 0}
            </CardContent>
          </Card>
        </div>
        
        {/* Вкладки с контентом */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="pages">Страницы</TabsTrigger>
            <TabsTrigger value="contributions">Вклад</TabsTrigger>
            <TabsTrigger value="activity">Активность</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pages" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Здесь будет список страниц пользователя */}
              {user.pages?.length ? (
                user.pages.map(page => (
                  <PageCard key={page.id} page={page} />
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-muted-foreground">У пользователя пока нет страниц</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="contributions" className="mt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Информация о вкладе пользователя будет доступна в ближайшее время</p>
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="mt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">История активности пользователя будет доступна в ближайшее время</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}; 