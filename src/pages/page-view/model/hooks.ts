import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/shared/ui/use-toast';
import { getPageById } from '@/entities/page';
import { getVersionsByPageId } from '@/entities/version';
import { PageViewState, HistoryViewState } from './types';

export const usePageView = (id: string): PageViewState => {
  const [state, setState] = useState<PageViewState>({
    loading: true,
    error: null,
    showHistory: false,
    selectedLanguage: 'en',
    page: null,
  });

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        const page = await getPageById(id);
        
        if (page) {
          setState(prev => ({ 
            ...prev, 
            page, 
            loading: false,
            error: null
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

  const toggleHistory = useCallback(() => {
    setState(prev => ({ ...prev, showHistory: !prev.showHistory }));
  }, []);

  const changeLanguage = useCallback((language: string) => {
    setState(prev => ({ ...prev, selectedLanguage: language }));
  }, []);

  return {
    ...state,
    showHistory: state.showHistory,
    selectedLanguage: state.selectedLanguage,
  };
};

export const useVersionHistory = (pageId: string): HistoryViewState => {
  const [state, setState] = useState<HistoryViewState>({
    versions: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        const versions = await getVersionsByPageId(pageId);
        
        setState({
          versions,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Ошибка загрузки версий:', error);
        setState({
          versions: [],
          loading: false,
          error: 'Ошибка загрузки истории версий'
        });
      }
    };

    fetchVersions();
  }, [pageId]);

  return state;
}; 