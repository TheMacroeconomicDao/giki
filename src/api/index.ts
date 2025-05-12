/**
 * API Layer (FSD Architecture)
 * Экспортирует модули API для использования в приложении
 */

// API для работы со страницами
export * from './pages';

// API для работы с пользователями
export * from './users';

// API для аутентификации
export * from './auth';

// API для настроек
export * from './settings';

// API для переводов
export * from './translate';

// Общие типы и утилиты для API
export * from './types';
export * from './utils'; 