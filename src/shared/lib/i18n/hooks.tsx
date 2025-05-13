/**
 * React-хуки для работы с локализацией
 */
// @ts-ignore - игнорируем ошибку с импортом React
import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { i18n, Locale } from './index';

// Контекст для локализации
interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, any>) => string;
  plural: (key: string, count: number, params?: Record<string, any>) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * Провайдер для локализации
 */
export function I18nProvider({
  children,
  initialLocale = 'ru',
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  
  // Меняем локаль
  const setLocale = useCallback((newLocale: Locale) => {
    i18n.setLocale(newLocale);
    setLocaleState(newLocale);
    
    // Сохраняем в localStorage для персистентности
    try {
      localStorage.setItem('giki_locale', newLocale);
    } catch (e) {
      // Игнорируем ошибки localStorage
    }
  }, []);
  
  // Инициализация локали из localStorage при загрузке
  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem('giki_locale') as Locale | null;
      
      if (savedLocale) {
        setLocale(savedLocale);
      } else {
        // Пробуем определить локаль по браузеру
        const browserLocale = navigator.language.split('-')[0] as Locale;
        setLocale(browserLocale || initialLocale);
      }
    } catch (e) {
      // Используем инициальную локаль, если что-то пошло не так
      setLocale(initialLocale);
    }
  }, [initialLocale, setLocale]);
  
  // Формируем контекст
  const contextValue: I18nContextValue = {
    locale,
    setLocale,
    t: i18n.t,
    plural: i18n.plural,
    formatDate: i18n.formatDate,
    formatNumber: i18n.formatNumber,
  };
  
  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Хук для доступа к функциям локализации
 */
export function useI18n() {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  
  return context as I18nContextValue;
}

/**
 * Компонент для локализованного текста
 */
export function T({
  keyName,
  params,
  children,
}: {
  keyName: string;
  params?: Record<string, any>;
  children?: ReactNode;
}) {
  const { t } = useI18n();
  
  return <>{t(keyName, params) || children}</>;
}

/**
 * Компонент для локализованного текста с плюрализацией
 */
export function Plural({
  keyName,
  count,
  params,
}: {
  keyName: string;
  count: number;
  params?: Record<string, any>;
}) {
  const { plural } = useI18n();
  
  return <>{plural(keyName, count, params)}</>;
}

/**
 * Компонент для форматирования даты
 */
export function LocalizedDate({
  date,
  options,
}: {
  date: Date;
  options?: Intl.DateTimeFormatOptions;
}) {
  const { formatDate } = useI18n();
  
  return <>{formatDate(date, options)}</>;
}

/**
 * Компонент для форматирования чисел
 */
export function LocalizedNumber({
  value,
  options,
}: {
  value: number;
  options?: Intl.NumberFormatOptions;
}) {
  const { formatNumber } = useI18n();
  
  return <>{formatNumber(value, options)}</>;
}
