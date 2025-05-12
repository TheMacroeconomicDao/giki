/**
 * Константы для настроек (FSD)
 */

/**
 * Настройки по умолчанию
 */
export const DEFAULT_SETTINGS = {
  system: {
    title: 'Giki - Web3 Wiki',
    description: 'A decentralized wiki platform built on Web3 technology',
    version: '1.0.0',
    allowSignups: true,
    defaultRole: 'viewer',
    maintenance: false,
    featuredPages: [],
  },
  ui: {
    theme: 'system',
    accentColor: 'blue',
    fontSize: 'medium',
    sidebar: {
      expanded: true,
      showRecent: true,
      showPopular: true,
    }
  },
  editor: {
    defaultFormat: 'markdown',
    autoSave: true,
    spellCheck: true,
    wordCount: true,
    preview: true,
  },
  translations: {
    enabled: true,
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ru', 'es', 'fr', 'de', 'zh'],
    useAI: true,
  },
  github: {
    enabled: false,
    autoSync: false,
    syncInterval: 3600, // в секундах
  },
}; 