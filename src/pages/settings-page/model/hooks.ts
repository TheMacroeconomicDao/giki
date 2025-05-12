import { useState, useCallback, useEffect } from 'react';
import { useSettingsStore } from '@/entities/settings';
import { useAuthStore } from '@/features/auth';
import { toast } from '@/shared/ui/use-toast';
import { SettingsPageState, SettingsTab } from './types';
import type { SystemSettings, UserSettings } from '@/entities/settings'; // Импортируем типы

/**
 * Хук для управления состоянием страницы настроек
 */
export const useSettingsPage = (): [
  Omit<SettingsPageState, 'isAdmin'> & { activeTab: SettingsTab, isAdmin: boolean }, // Добавляем activeTab и isAdmin в возвращаемый тип
  {
    setActiveTab: (tab: SettingsTab) => void;
    updateSystemSetting: <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => void; // Используем SystemSettings
    updateUserSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void; // Используем UserSettings
    handleSaveSettings: () => Promise<boolean>;
  }
] => {
  const { settings: initialSettings, isLoading: settingsLoading, updateSetting: updateGlobalSetting } = useSettingsStore();
  const { user, status: authStatus } = useAuthStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>('general'); // activeTab как отдельное состояние
  const isAdmin = user?.role === 'admin';

  const [state, setState] = useState<Omit<SettingsPageState, 'isAdmin'>>({
    loading: settingsLoading || authStatus === 'loading',
    saving: false,
    error: null,
    systemSettings: initialSettings.system,
    userSettings: initialSettings.ui,
  });

  useEffect(() => {
    setState(prev => ({
      ...prev,
      loading: settingsLoading || authStatus === 'loading',
      systemSettings: initialSettings.system,
      userSettings: initialSettings.ui,
    }));
  }, [initialSettings, settingsLoading, authStatus]);

  const updateSystemSetting = useCallback(<K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setState(prev => ({
      ...prev,
      systemSettings: { ...prev.systemSettings, [key]: value }
    }));
  }, []);

  const updateUserSetting = useCallback(<K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setState(prev => ({
      ...prev,
      userSettings: { ...prev.userSettings, [key]: value }
    }));
  }, []);

  const handleSaveSettings = useCallback(async (): Promise<boolean> => {
    if (!user) {
      toast.error('Пожалуйста, войдите в систему для сохранения настроек.');
      return false;
    }

    setState(prev => ({ ...prev, saving: true, error: null }));
    try {
      // Обновляем глобальный стор
      updateGlobalSetting('system', state.systemSettings); // Передаем весь объект
      updateGlobalSetting('ui', state.userSettings);       // Передаем весь объект

      // TODO: Реализовать вызовы API для сохранения настроек на бэкенде
      console.log('Saving User Settings to backend:', state.userSettings);
      console.log('Saving System Settings to backend:', state.systemSettings);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация API

      toast.success('Настройки успешно сохранены!');
      setState(prev => ({ ...prev, saving: false }));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка сохранения';
      console.error('Ошибка сохранения настроек:', err);
      toast.error(`Не удалось сохранить настройки: ${errorMessage}`);
      setState(prev => ({ ...prev, saving: false, error: errorMessage }));
      return false;
    }
  }, [user, state.userSettings, state.systemSettings, updateGlobalSetting, isAdmin]);

  return [
    { ...state, activeTab, isAdmin }, // Возвращаем объединенное состояние
    {
      setActiveTab,
      updateSystemSetting,
      updateUserSetting,
      handleSaveSettings,
    }
  ];
}; 