import { SystemSettings, UserSettings } from '@/entities/settings';

/**
 * Состояние компонента страницы настроек
 */
export interface SettingsPageState {
  loading: boolean;
  saving: boolean;
  error: string | null;
  systemSettings: SystemSettings | null;
  userSettings: UserSettings | null;
  isAdmin: boolean;
}

/**
 * Параметры компонента страницы настроек
 */
export interface SettingsPageProps {
  // Пока нет параметров
}

/**
 * Вкладки настроек
 */
export type SettingsTab = 'profile' | 'appearance' | 'notifications' | 'system' | 'api'; 