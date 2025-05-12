import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/shared/ui/use-toast';
import { getPageById, createPage, updatePage, PageVisibility } from '@/entities/page';
import { PageEditState, PageEditFormData } from './types';

/**
 * Хук для управления состоянием редактирования страницы
 */
export const usePageEdit = (id?: string): [PageEditState, {
  updateTitle: (value: string) => void;
  updateContent: (value: string) => void;
  updateVisibility: (value: PageVisibility) => void;
  savePage: () => Promise<boolean>;
  cancelEdit: () => void;
}] => {
  const router = useRouter();
  const [state, setState] = useState<PageEditState>({
    loading: Boolean(id),
    saving: false,
    error: null,
    page: null,
    title: '',
    content: '',
    visibility: 'public',
    isModified: false,
  });

  // Загружаем существующую страницу по ID
  useEffect(() => {
    const fetchPage = async () => {
      if (!id) return;

      try {
        setState(prev => ({ ...prev, loading: true }));
        const page = await getPageById(id);
        
        if (page) {
          setState(prev => ({
            ...prev,
            page,
            title: page.title,
            content: page.content,
            visibility: page.visibility,
            loading: false,
            error: null,
            isModified: false,
          }));
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Страница не найдена'
          }));
        }
      } catch (error) {
        console.error('Ошибка загрузки страницы:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Ошибка загрузки страницы'
        }));
        
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить страницу',
          variant: 'destructive',
        });
      }
    };

    fetchPage();
  }, [id]);

  // Обновление заголовка
  const updateTitle = useCallback((value: string) => {
    setState(prev => ({
      ...prev,
      title: value,
      isModified: true,
    }));
  }, []);

  // Обновление содержимого
  const updateContent = useCallback((value: string) => {
    setState(prev => ({
      ...prev,
      content: value,
      isModified: true,
    }));
  }, []);

  // Обновление видимости
  const updateVisibility = useCallback((value: PageVisibility) => {
    setState(prev => ({
      ...prev,
      visibility: value,
      isModified: true,
    }));
  }, []);

  // Сохранение страницы
  const savePage = useCallback(async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, saving: true }));

      const pageData: PageEditFormData = {
        title: state.title,
        content: state.content,
        visibility: state.visibility,
      };

      if (id) {
        // Обновление существующей страницы
        await updatePage(id, pageData);
        toast({
          title: 'Сохранено',
          description: 'Страница успешно обновлена',
        });
      } else {
        // Создание новой страницы
        const newPage = await createPage(pageData);
        toast({
          title: 'Создано',
          description: 'Новая страница успешно создана',
        });
        
        // Перенаправляем на просмотр созданной страницы
        router.push(`/pages/${newPage.id}`);
      }

      setState(prev => ({
        ...prev,
        saving: false,
        isModified: false,
      }));
      
      return true;
    } catch (error) {
      console.error('Ошибка сохранения страницы:', error);
      setState(prev => ({ ...prev, saving: false }));
      
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить страницу',
        variant: 'destructive',
      });
      
      return false;
    }
  }, [id, state.title, state.content, state.visibility, router]);

  // Отмена редактирования
  const cancelEdit = useCallback(() => {
    if (id) {
      // Возврат к просмотру страницы
      router.push(`/pages/${id}`);
    } else {
      // Возврат на главную
      router.push('/');
    }
  }, [id, router]);

  return [
    state,
    {
      updateTitle,
      updateContent,
      updateVisibility,
      savePage,
      cancelEdit,
    }
  ];
}; 