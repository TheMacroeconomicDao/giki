import { useState } from 'react';
import { useTranslation } from '../model/useTranslation';
import { Button } from '@/shared/ui/button';
import { Select } from '@/shared/ui/select';

/**
 * Форма перевода страницы
 */
export const TranslatePageForm = ({ pageId, content }: { pageId: string; content: string }) => {
  const [targetLanguage, setTargetLanguage] = useState('en');
  const { translate, isLoading, error } = useTranslation();

  const handleTranslate = async () => {
    await translate({
      pageId,
      content,
      targetLanguage,
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="text-lg font-medium">Перевести страницу</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Язык перевода</label>
        <Select
          value={targetLanguage}
          onValueChange={setTargetLanguage}
          options={[
            { value: 'en', label: 'Английский' },
            { value: 'fr', label: 'Французский' },
            { value: 'de', label: 'Немецкий' },
            { value: 'es', label: 'Испанский' },
            { value: 'it', label: 'Итальянский' },
            { value: 'zh', label: 'Китайский' },
          ]}
        />
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <Button 
        onClick={handleTranslate} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Переводим...' : 'Перевести'}
      </Button>
    </div>
  );
};
