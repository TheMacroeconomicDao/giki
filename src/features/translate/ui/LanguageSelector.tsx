import type { AvailableLanguage } from '../model/types';
import { Select } from '@/shared/ui/select';

interface LanguageSelectorProps {
  languages: AvailableLanguage[];
  selectedLanguage: string;
  onChange: (language: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function LanguageSelector({
  languages,
  selectedLanguage,
  onChange,
  disabled = false,
  placeholder = 'Выберите язык'
}: LanguageSelectorProps) {
  return (
    <Select
      value={selectedLanguage}
      onValueChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      options={languages.map(lang => ({
        value: lang.code,
        label: `${lang.name} ${lang.nativeName ? `(${lang.nativeName})` : ''}`
      }))}
    />
  );
}
