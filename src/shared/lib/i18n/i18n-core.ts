/**
 * Ядро системы локализации
 * @module
 */

import { logger } from '@/shared/lib/logger';

// Типы поддерживаемых языков
export type Locale = 'ru' | 'en' | 'fr' | 'es' | 'de' | 'zh' | string;

// Словарь для хранения переводов
export type TranslationDictionary = Record<string, string | Record<string, string>>;

// Основной класс локализации
export class I18nCore {
  // Текущая локаль
  private currentLocale: Locale = 'ru';
  
  // Словари переводов по языкам
  private translations: Record<Locale, TranslationDictionary> = {
    ru: {},
    en: {},
  };
  
  // Функции форматирования для плюральных форм
  private pluralRules: Record<Locale, (n: number) => number> = {
    ru: (n: number) => {
      const lastDigit = n % 10;
      const lastTwoDigits = n % 100;
      
      if (lastDigit === 1 && lastTwoDigits !== 11) {
        return 0; // одна книга
      } else if (
        lastDigit >= 2 && 
        lastDigit <= 4 && 
        !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
      ) {
        return 1; // две/три/четыре книги
      } else {
        return 2; // пять книг
      }
    },
    en: (n: number) => n === 1 ? 0 : 1, // one book, two books
    fr: (n: number) => n === 1 ? 0 : 1,
    es: (n: number) => n === 1 ? 0 : 1,
    de: (n: number) => n === 1 ? 0 : 1,
    zh: (_: number) => 0, // Китайский не использует плюральные формы
  };
  
  /**
   * Устанавливает текущую локаль
   */
  setLocale(locale: Locale): void {
    if (!Object.keys(this.translations).includes(locale)) {
      logger.warn(`Locale ${locale} is not loaded, falling back to default`);
      return;
    }
    
    this.currentLocale = locale;
    logger.info(`Locale set to ${locale}`);
  }
  
  /**
   * Возвращает текущую локаль
   */
  getLocale(): Locale {
    return this.currentLocale;
  }
  
  /**
   * Добавляет словарь переводов для языка
   */
  addTranslations(locale: Locale, translations: TranslationDictionary): void {
    this.translations[locale] = {
      ...this.translations[locale],
      ...translations
    };
    
    logger.debug(`Added translations for ${locale}`);
  }
  
  /**
   * Добавляет функцию для определения множественных форм
   */
  addPluralRule(locale: Locale, ruleFn: (n: number) => number): void {
    this.pluralRules[locale] = ruleFn;
  }
  
  /**
   * Получает перевод по ключу
   */
  t(key: string, params?: Record<string, any>): string {
    // Проверяем на вложенные ключи (например, 'errors.notFound')
    const keys = key.split('.');
    let translation: any = this.translations[this.currentLocale];
    
    // Проходим по вложенным ключам
    for (const k of keys) {
      if (!translation || typeof translation !== 'object') {
        logger.warn(`Translation key not found: ${key} (${this.currentLocale})`);
        return key; // Возвращаем ключ, если перевод не найден
      }
      
      translation = translation[k];
    }
    
    // Если перевод не найден, пробуем в английской локали или возвращаем ключ
    if (!translation && this.currentLocale !== 'en') {
      let fallbackTranslation: any = this.translations['en'];
      
      for (const k of keys) {
        if (!fallbackTranslation || typeof fallbackTranslation !== 'object') {
          logger.warn(`Fallback translation key not found: ${key} (en)`);
          return key;
        }
        
        fallbackTranslation = fallbackTranslation[k];
      }
      
      translation = fallbackTranslation || key;
    }
    
    // Если это не строка, возвращаем ключ
    if (typeof translation !== 'string') {
      return key;
    }
    
    // Заменяем параметры в переводе
    if (params) {
      return Object.entries(params).reduce((result, [paramKey, value]) => {
        return result.replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'), String(value));
      }, translation);
    }
    
    return translation;
  }
  
  /**
   * Возвращает перевод с множественными формами
   */
  plural(key: string, count: number, params?: Record<string, any>): string {
    // Формируем ключи для множественных форм
    const pluralKeys = [
      `${key}.0`,
      `${key}.1`,
      `${key}.2`,
    ];
    
    // Получаем индекс формы по правилу для текущего языка
    const rule = this.pluralRules[this.currentLocale] || this.pluralRules.en;
    const formIndex = rule(count);
    
    // Получаем перевод для нужной формы
    const pluralKey = pluralKeys[formIndex] || pluralKeys[0];
    
    // Объединяем параметры с количеством
    const allParams = {
      count,
      ...params
    };
    
    return this.t(pluralKey, allParams);
  }
  
  /**
   * Переводит дату в локализованный формат
   */
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    try {
      return new Intl.DateTimeFormat(
        this.currentLocale, 
        options || { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }
      ).format(date);
    } catch (error) {
      logger.error(`Error formatting date: ${error}`);
      return date.toISOString();
    }
  }
  
  /**
   * Форматирует число в соответствии с локалью
   */
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    try {
      return new Intl.NumberFormat(
        this.currentLocale, 
        options
      ).format(number);
    } catch (error) {
      logger.error(`Error formatting number: ${error}`);
      return String(number);
    }
  }
}

// Создаем и экспортируем глобальный экземпляр
export const i18nCore = new I18nCore();

export default i18nCore;
