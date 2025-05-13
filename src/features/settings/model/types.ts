/**
 * Типы для модуля настроек
 */

/**
 * Профиль пользователя
 */
export interface UserProfile {
  id: string;
  address: string;
  name: string | null;
  bio: string | null;
  avatar: string | null;
  joinedAt: string;
  lastLogin: string;
}

/**
 * Настройки интерфейса
 */
export interface UIPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  editorMode: 'simple' | 'advanced';
  markdownPreview: boolean;
  language: string;
}

/**
 * Настройки уведомлений
 */
export interface NotificationSettings {
  emailNotifications: boolean;
  browserNotifications: boolean;
  notifyOnPageEdits: boolean;
  notifyOnMentions: boolean;
  notifyOnComments: boolean;
  emailDigest: 'daily' | 'weekly' | 'never';
}

/**
 * Настройки приватности
 */
export interface PrivacySettings {
  showProfileToOthers: boolean;
  showActivityToOthers: boolean;
  defaultPageVisibility: 'public' | 'private';
}

/**
 * Агрегированные настройки пользователя
 */
export interface UserSettings {
  profile: UserProfile | null;
  ui: UIPreferences;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

/**
 * Обновление профиля
 */
export interface ProfileUpdateData {
  name?: string | null;
  bio?: string | null;
  avatar?: File | null;
}

/**
 * Состояние настроек
 */
export interface SettingsState {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Действия для управления настройками
 */
export type SettingsActions = {
  // Общие действия
  setSettings: (settings: UserSettings | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  
  // Загрузка и сохранение настроек
  fetchSettings: () => Promise<void>;
  
  // Обновление профиля
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  
  // Обновление UI настроек
  updateUIPreferences: (preferences: Partial<UIPreferences>) => Promise<void>;
  
  // Обновление настроек уведомлений
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  
  // Обновление настроек приватности
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => Promise<void>;
};

// Агрегированные типы состояния и действий для использования в хранилище
export type SettingsStore = SettingsState & SettingsActions;

// Типы для данных, используемых в API (примеры)
