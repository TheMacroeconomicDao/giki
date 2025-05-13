import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import type { Draft } from 'immer';
import type { 
  SettingsState, 
  UserSettings, 
  ProfileUpdateData,
  UIPreferences,
  NotificationSettings,
  PrivacySettings,
  SettingsActions
} from './types';

// Начальные состояния
const initialUIPreferences: UIPreferences = {
  theme: 'system',
  fontSize: 'medium',
  editorMode: 'simple',
  markdownPreview: true,
  language: 'ru',
};

const initialNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  browserNotifications: true,
  notifyOnPageEdits: true,
  notifyOnMentions: true,
  notifyOnComments: true,
  emailDigest: 'daily',
};

const initialPrivacySettings: PrivacySettings = {
  showProfileToOthers: true,
  showActivityToOthers: true,
  defaultPageVisibility: 'public',
};

const initialUserSettings: UserSettings = {
  profile: null,
  ui: initialUIPreferences,
  notifications: initialNotificationSettings,
  privacy: initialPrivacySettings,
};

const initialState: SettingsState = {
  settings: null,
  isLoading: false,
  error: null,
};

/**
 * Хранилище для управления настройками пользователя
 */
export const useSettingsStore = create<SettingsState & SettingsActions>()(
  devtools(
    immer<SettingsState & SettingsActions>((set, get) => ({ 
      ...initialState,

      // Устанавливает все настройки
      setSettings: (settings: UserSettings | null) => 
        set((state: Draft<SettingsState & SettingsActions>) => { 
          state.settings = settings; 
        }),

      // Устанавливает состояние загрузки
      setLoading: (isLoading: boolean) => 
        set((state: Draft<SettingsState & SettingsActions>) => { 
          state.isLoading = isLoading; 
        }),

      // Устанавливает ошибку
      setError: (error: string | null) => 
        set((state: Draft<SettingsState & SettingsActions>) => { 
          state.error = error; 
        }),

      // Сбрасывает состояние настроек
      reset: () => 
        set((state: Draft<SettingsState & SettingsActions>) => { 
          Object.assign(state, initialState); 
        }),

      // Загружает настройки с сервера
      fetchSettings: async () => {
        const { setLoading, setError, setSettings } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          // Здесь будет вызов API
          const response = await fetch('/api/settings');
          if (!response.ok) throw new Error('Ошибка загрузки настроек');
          
          const data = await response.json();
          setSettings(data || initialUserSettings);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
          setSettings(initialUserSettings);
        } finally {
          setLoading(false);
        }
      },

      // Обновляет профиль пользователя
      updateProfile: async (data: ProfileUpdateData) => {
        const { setLoading, setError, settings, setSettings } = get();
        
        if (!settings) {
          setError('Настройки не загружены');
          return;
        }
        
        try {
          setLoading(true);
          setError(null);
          
          const formData = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
              formData.append(key, value as string | Blob);
            }
          });
          
          const response = await fetch('/api/settings/profile', {
            method: 'PUT',
            body: formData,
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка сохранения профиля');
          }
          
          const updatedProfile = await response.json();
          setSettings({
            ...settings,
            profile: updatedProfile,
          });
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
        } finally {
          setLoading(false);
        }
      },

      // Обновляет настройки интерфейса
      updateUIPreferences: async (preferences: Partial<UIPreferences>) => {
        const { setLoading, setError, settings, setSettings } = get();
        
        if (!settings) {
          setError('Настройки не загружены');
          return;
        }
        
        try {
          setLoading(true);
          setError(null);
          
          const updatedUI = { ...settings.ui, ...preferences };
          setSettings({
            ...settings,
            ui: updatedUI,
          });
          
          const response = await fetch('/api/settings/ui', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(preferences),
          });
          
          if (!response.ok) {
            setSettings(settings);
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка сохранения настроек интерфейса');
          }
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
        } finally {
          setLoading(false);
        }
      },

      // Обновляет настройки уведомлений
      updateNotificationSettings: async (notificationSettings: Partial<NotificationSettings>) => {
        const { setLoading, setError, settings, setSettings } = get();
        
        if (!settings) {
          setError('Настройки не загружены');
          return;
        }
        
        try {
          setLoading(true);
          setError(null);
          
          const updatedNotifications = { ...settings.notifications, ...notificationSettings };
          setSettings({
            ...settings,
            notifications: updatedNotifications,
          });
          
          const response = await fetch('/api/settings/notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notificationSettings),
          });
          
          if (!response.ok) {
            setSettings(settings);
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка сохранения настроек уведомлений');
          }
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
        } finally {
          setLoading(false);
        }
      },

      // Обновляет настройки приватности
      updatePrivacySettings: async (privacySettings: Partial<PrivacySettings>) => {
        const { setLoading, setError, settings, setSettings } = get();
        
        if (!settings) {
          setError('Настройки не загружены');
          return;
        }
        
        try {
          setLoading(true);
          setError(null);
          
          const updatedPrivacy = { ...settings.privacy, ...privacySettings };
          setSettings({
            ...settings,
            privacy: updatedPrivacy,
          });
          
          const response = await fetch('/api/settings/privacy', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(privacySettings),
          });
          
          if (!response.ok) {
            setSettings(settings); // Восстанавливаем предыдущее состояние
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка сохранения настроек приватности');
          }
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
        } finally {
          setLoading(false);
        }
      },
    })), 
    { name: 'settings-store' }
  )
);
