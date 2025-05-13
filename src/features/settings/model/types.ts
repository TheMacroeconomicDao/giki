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
 * Аггрегированные настройки пользователя
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
