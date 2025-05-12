import { SystemSettings as SystemSettingsEntity, UserSettings as UserSettingsEntity, UISettings, SystemSettings as SimpleSystemSettings } from '@/entities/settings';

/**
 * Состояние компонента страницы настроек
 */
export interface SettingsPageState {
  loading: boolean;
  saving: boolean;
  error: string | null;
  systemSettings: SimpleSystemSettings;
  userSettings: UISettings;
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
export type SettingsTab = 'profile' | 'appearance' | 'notifications' | 'system' | 'api' | 'general'; 