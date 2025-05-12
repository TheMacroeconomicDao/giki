import { useState } from 'react';
import { translationApi } from '../api/translationApi';

type TranslateParams = {
  pageId: string;
  content: string;
  targetLanguage: string;
};

export function useTranslation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = async (params: TranslateParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await translationApi.translatePage(
        params.pageId,
        params.content,
        params.targetLanguage
      );
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при переводе');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    translate,
    isLoading,
    error,
  };
}
