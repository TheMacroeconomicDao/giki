import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import type { 
  SettingsState, 
  UserSettings, 
  ProfileUpdateData,
  UIPreferences,
  NotificationSettings,
  PrivacySettings
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

type SettingsActions = {
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

/**
 * Стор для управления настройками пользователя
 */
export const useSettingsStore = create<SettingsState & SettingsActions>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // Устанавливает все настройки
      setSettings: (settings) => set((state) => {
        state.settings = settings;
        return state;
      }),

      // Устанавливает состояние загрузки
      setLoading: (isLoading) => set((state) => {
        state.isLoading = isLoading;
        return state;
      }),

      // Устанавливает ошибку
      setError: (error) => set((state) => {
        state.error = error;
        return state;
      }),

      // Сбрасывает состояние настроек
      reset: () => set(initialState),

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
          // Устанавливаем дефолтные настройки в случае ошибки
          setSettings(initialUserSettings);
        } finally {
          setLoading(false);
        }
      },

      // Обновляет профиль пользователя
      updateProfile: async (data) => {
        const { setLoading, setError, settings, setSettings } = get();
        
        if (!settings) {
          setError('Настройки не загружены');
          return;
        }
        
        try {
          setLoading(true);
          setError(null);
          
          // Формируем FormData для отправки файлов
          const formData = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
              formData.append(key, value as string | Blob);
            }
          });
          
          // Здесь будет вызов API
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
      updateUIPreferences: async (preferences) => {
        const { setLoading, setError, settings, setSettings } = get();
        
        if (!settings) {
          setError('Настройки не загружены');
          return;
        }
        
        try {
          setLoading(true);
          setError(null);
          
          // Оптимистично обновляем UI (до ответа сервера)
          const updatedUI = { ...settings.ui, ...preferences };
          setSettings({
            ...settings,
            ui: updatedUI,
          });
          
          // Здесь будет вызов API
          const response = await fetch('/api/settings/ui', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(preferences),
          });
          
          if (!response.ok) {
            // В случае ошибки откатываем обновление
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
      updateNotificationSettings: async (notificationSettings) => {
        const { setLoading, setError, settings, setSettings } = get();
        
        if (!settings) {
          setError('Настройки не загружены');
          return;
        }
        
        try {
          setLoading(true);
          setError(null);
          
          // Оптимистично обновляем настройки уведомлений
          const updatedNotifications = { ...settings.notifications, ...notificationSettings };
          setSettings({
            ...settings,
            notifications: updatedNotifications,
          });
          
          // Здесь будет вызов API
          const response = await fetch('/api/settings/notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notificationSettings),
          });
          
          if (!response.ok) {
            // В случае ошибки откатываем обновление
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
      updatePrivacySettings: async (privacySettings) => {
        const { setLoading, setError, settings, setSettings } = get();
        
        if (!settings) {
          setError('Настройки не загружены');
          return;
        }
        
        try {
          setLoading(true);
          setError(null);
          
          // Оптимистично обновляем настройки приватности
          const updatedPrivacy = { ...settings.privacy, ...privacySettings };
          setSettings({
            ...settings,
            privacy: updatedPrivacy,
          });
          
          // Здесь будет вызов API
          const response = await fetch('/api/settings/privacy', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(privacySettings),
          });
          
          if (!response.ok) {
            // В случае ошибки откатываем обновление
            setSettings(settings);
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
