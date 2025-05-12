'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Globe, Users, Lock } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { PageContent } from '@/entities/page';
import { usePageEdit } from '../model/hooks';
import { PageEditProps } from '../model/types';

/**
 * Компонент для создания и редактирования wiki-страницы
 */
export const PageEdit = ({ id }: PageEditProps) => {
  const router = useRouter();
  const isEditMode = Boolean(id);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  
  // Получаем состояние и методы из хука редактирования
  const [
    { title, content, visibility, loading, saving, error, isModified },
    { updateTitle, updateContent, updateVisibility, savePage, cancelEdit }
  ] = usePageEdit(id);

  // Обработка отмены редактирования с проверкой на изменения
  const handleCancel = useCallback(() => {
    if (isModified) {
      if (window.confirm('У вас есть несохраненные изменения. Вы уверены, что хотите уйти со страницы?')) {
        cancelEdit();
      }
    } else {
      cancelEdit();
    }
  }, [isModified, cancelEdit]);
  
  // Обработка сохранения
  const handleSave = useCallback(async () => {
    await savePage();
  }, [savePage]);

  // Предупреждение при уходе со страницы с несохраненными изменениями
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isModified) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isModified]);

  // Отображение загрузки
  if (loading) {
    return (
      <div className="container mx-auto py-10 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </div>
    );
  }

  // Отображение ошибки
  if (error) {
    return (
      <div className="container mx-auto py-10 max-w-4xl">
        <Alert variant="destructive">
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-4">
          <Button onClick={() => router.push('/')}>Вернуться на главную</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex flex-col gap-6">
        {/* Верхняя панель навигации */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleCancel} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="default" onClick={handleSave} disabled={saving} className="gap-1">
              <Save className="h-4 w-4" />
              {saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </div>

        {/* Форма редактирования */}
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Редактирование страницы' : 'Создание новой страницы'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Заголовок страницы */}
            <div className="space-y-2">
              <Label htmlFor="title">Заголовок</Label>
              <Input 
                id="title"
                value={title} 
                onChange={(e) => updateTitle(e.target.value)}
                placeholder="Введите заголовок страницы"
                className="text-lg"
              />
            </div>

            {/* Переключатель режимов редактирования/предпросмотра */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">Редактирование</TabsTrigger>
                <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
              </TabsList>
              <TabsContent value="edit" className="mt-4">
                <Textarea 
                  value={content} 
                  onChange={(e) => updateContent(e.target.value)}
                  placeholder="Введите содержимое страницы в формате Markdown"
                  className="min-h-[300px] font-mono text-sm"
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <Card>
                  <CardContent className="prose dark:prose-invert p-4 max-w-none">
                    <PageContent content={content} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Выбор видимости страницы */}
            <div className="space-y-2">
              <Label>Видимость страницы</Label>
              <RadioGroup 
                value={visibility} 
                onValueChange={(value) => updateVisibility(value as any)}
                className="grid grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="flex items-center gap-1 cursor-pointer">
                    <Globe className="h-4 w-4" />
                    Общедоступная
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="community" id="community" />
                  <Label htmlFor="community" className="flex items-center gap-1 cursor-pointer">
                    <Users className="h-4 w-4" />
                    Сообщество
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="flex items-center gap-1 cursor-pointer">
                    <Lock className="h-4 w-4" />
                    Личная
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              {isEditMode 
                ? 'Редактирование существующей страницы' 
                : 'Создание новой страницы'}
            </p>
            <Button variant="outline" onClick={handleCancel}>
              Отмена
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}; 