/**
 * Система интернационализации 
 * @module
 */

import { i18nCore, Locale, TranslationDictionary } from './i18n-core';
export * from './i18n-core';

// Базовые переводы для русского
const ruTranslations: TranslationDictionary = {
  common: {
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    create: 'Создать',
    search: 'Поиск',
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успешно',
    close: 'Закрыть',
    back: 'Назад',
    next: 'Далее',
  },
  errors: {
    notFound: 'Не найдено',
    serverError: 'Ошибка сервера',
    unauthorized: 'Требуется авторизация',
    forbidden: 'Доступ запрещен',
    validationError: 'Ошибка валидации',
  },
  auth: {
    signIn: 'Войти',
    signUp: 'Зарегистрироваться',
    signOut: 'Выйти',
    username: 'Имя пользователя',
    password: 'Пароль',
    email: 'Email',
    forgotPassword: 'Забыли пароль?',
  },
  wiki: {
    page: 'Страница',
    pages: 'Страницы',
    newPage: 'Новая страница',
    editPage: 'Редактировать страницу',
    deletePage: 'Удалить страницу',
    pageHistory: 'История изменений',
    contributors: 'Авторы',
    created: 'Создано',
    updated: 'Обновлено',
    versions: 'Версии',
    recentChanges: 'Недавние изменения',
    pageNotFound: 'Страница не найдена',
  },
  notifications: {
    pageCreated: 'Страница создана',
    pageUpdated: 'Страница обновлена',
    pageDeleted: 'Страница удалена',
    changesSaved: 'Изменения сохранены',
    operationSuccessful: 'Операция выполнена успешно',
    operationFailed: 'Операция не выполнена',
  },
  plurals: {
    'pages.0': '{{count}} страница',
    'pages.1': '{{count}} страницы',
    'pages.2': '{{count}} страниц',
    'users.0': '{{count}} пользователь',
    'users.1': '{{count}} пользователя',
    'users.2': '{{count}} пользователей',
  },
};

// Базовые переводы для английского
const enTranslations: TranslationDictionary = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    close: 'Close',
    back: 'Back',
    next: 'Next',
  },
  errors: {
    notFound: 'Not found',
    serverError: 'Server error',
    unauthorized: 'Authentication required',
    forbidden: 'Access denied',
    validationError: 'Validation error',
  },
  auth: {
    signIn: 'Sign in',
    signUp: 'Sign up',
    signOut: 'Sign out',
    username: 'Username',
    password: 'Password',
    email: 'Email',
    forgotPassword: 'Forgot password?',
  },
  wiki: {
    page: 'Page',
    pages: 'Pages',
    newPage: 'New page',
    editPage: 'Edit page',
    deletePage: 'Delete page',
    pageHistory: 'Page history',
    contributors: 'Contributors',
    created: 'Created',
    updated: 'Updated',
    versions: 'Versions',
    recentChanges: 'Recent changes',
    pageNotFound: 'Page not found',
  },
  notifications: {
    pageCreated: 'Page created',
    pageUpdated: 'Page updated',
    pageDeleted: 'Page deleted',
    changesSaved: 'Changes saved',
    operationSuccessful: 'Operation successful',
    operationFailed: 'Operation failed',
  },
  plurals: {
    'pages.0': '{{count}} page',
    'pages.1': '{{count}} pages',
    'users.0': '{{count}} user',
    'users.1': '{{count}} users',
  },
};

// Добавляем базовые переводы
i18nCore.addTranslations('ru', ruTranslations);
i18nCore.addTranslations('en', enTranslations);

// Экспортируем основные функции
export const t = i18nCore.t.bind(i18nCore);
export const plural = i18nCore.plural.bind(i18nCore);
export const formatDate = i18nCore.formatDate.bind(i18nCore);
export const formatNumber = i18nCore.formatNumber.bind(i18nCore);
export const setLocale = i18nCore.setLocale.bind(i18nCore);
export const getLocale = i18nCore.getLocale.bind(i18nCore);

export const i18n = {
  t,
  plural,
  formatDate,
  formatNumber,
  setLocale,
  getLocale,
  addTranslations: i18nCore.addTranslations.bind(i18nCore),
};

export default i18n;
