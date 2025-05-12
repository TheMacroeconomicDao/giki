'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, History, Clock, Eye, Globe, Users, Lock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Skeleton } from '@/shared/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/shared/ui/use-toast';
import { PageContent } from '@/entities/page';
import { VersionCard, VersionDiff } from '@/entities/version';
import { usePageView, useVersionHistory } from '../model';
import { PageViewProps } from '../model';

/**
 * Компонент просмотра wiki-страницы
 */
export const PageView = ({ id }: PageViewProps) => {
  const router = useRouter();
  const { 
    page, 
    loading, 
    error, 
    showHistory, 
    selectedLanguage 
  } = usePageView(id);
  
  const { versions, loading: versionsLoading } = useVersionHistory(id);

  const handleEditPage = () => {
    router.push(`/pages/${id}/edit`);
  };

  const handleRestoreVersion = (content: string) => {
    // В реальном приложении здесь будет вызов API для обновления страницы
    toast({
      title: 'Версия восстановлена',
      description: 'Страница обновлена выбранной версией'
    });
  };

  // Отображение индикатора загрузки
  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Отображение ошибки
  if (error || !page) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Ошибка</h1>
        <p>{error || 'Страница не найдена'}</p>
        <Button className="mt-4" onClick={() => router.push('/')}>
          Вернуться на главную
        </Button>
      </div>
    );
  }

  // Получение иконки видимости страницы
  const getVisibilityIcon = () => {
    switch (page.visibility) {
      case 'public':
        return <Globe className="h-4 w-4" />;
      case 'community':
        return <Users className="h-4 w-4" />;
      case 'private':
        return <Lock className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  // Получение текста видимости страницы
  const getVisibilityText = () => {
    switch (page.visibility) {
      case 'public':
        return 'Общедоступная';
      case 'community':
        return 'Сообщество';
      case 'private':
        return 'Личная';
      default:
        return 'Общедоступная';
    }
  };

  // Доступные языки для страницы
  const availableLanguages = ['en', ...Object.keys(page.translations || {})];

  // Получение контента страницы
  const getContent = () => {
    if (selectedLanguage === 'en') {
      return page.content;
    }
    return page.translations?.[selectedLanguage] || 'Перевод недоступен';
  };

  return (
    <div className="container mx-auto max-w-5xl py-6">
      <div className="flex flex-col gap-6">
        {/* Верхняя панель навигации */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => {}} className="gap-1">
              <History className="h-4 w-4" />
              {showHistory ? 'Скрыть историю' : 'История версий'}
            </Button>
            <Button onClick={handleEditPage} className="gap-1">
              <Edit className="h-4 w-4" />
              Редактировать
            </Button>
          </div>
        </div>

        {/* Заголовок и метаданные страницы */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{page.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {getVisibilityIcon()}
              <span>{getVisibilityText()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{page.viewCount || 0} просмотров</span>
            </div>
          </div>
        </div>

        {/* Информация об авторе и времени обновления */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={page.author.avatarUrl || ''} />
              <AvatarFallback>{page.author.name?.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{page.author.name || 'Пользователь'}</div>
              <div className="text-sm text-muted-foreground">
                {page.author.address?.slice(0, 6)}...{page.author.address?.slice(-4) || 'Адрес не указан'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Обновлено {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Отображение истории версий или контента страницы */}
        {showHistory ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">История версий</h2>
            {versionsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {versions.map(version => (
                  <VersionCard
                    key={version.id}
                    version={version}
                    onRestore={() => handleRestoreVersion(version.content)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Переключатель языков */}
            {availableLanguages.length > 1 && (
              <div className="mb-4">
                <Tabs value={selectedLanguage} className="w-full">
                  <TabsList>
                    {availableLanguages.map(lang => (
                      <TabsTrigger key={lang} value={lang}>
                        {lang === 'en'
                          ? 'Английский'
                          : lang === 'es'
                            ? 'Испанский'
                            : lang === 'fr'
                              ? 'Французский'
                              : lang === 'ru'
                                ? 'Русский'
                                : lang === 'de'
                                  ? 'Немецкий'
                                  : lang}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            )}

            {/* Контент страницы */}
            <Card>
              <CardContent className="p-6">
                <PageContent content={getContent()} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}; 