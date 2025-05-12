import { useState, useEffect, useCallback } from 'react';
import { useSettingsStore } from '@/entities/settings';
import { useAuthStore } from '@/features/auth';
import { toast } from '@/shared/ui/use-toast';
import { SettingsPageState, SettingsTab } from './types';

/**
 * Хук для управления состоянием страницы настроек
 */
export const useSettingsPage = (): [
  SettingsPageState, 
  {
    updateSystemSetting: (key: string, value: string) => void;
    updateUserSetting: (key: string, value: string | boolean | number) => void;
    saveSettings: () => Promise<boolean>;
  },
  SettingsTab,
  (tab: SettingsTab) => void
] => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { systemSettings, userSettings, updateSystemSetting, updateUserSetting, saveSettings } = useSettingsStore();
  const { user } = useAuthStore();
  
  const [state, setState] = useState<SettingsPageState>({
    loading: true,
    saving: false,
    error: null,
    systemSettings: null,
    userSettings: null,
    isAdmin: false,
  });

  // Загрузка настроек
  useEffect(() => {
    setState(prev => ({
      ...prev,
      systemSettings,
      userSettings,
      isAdmin: user?.role === 'admin',
      loading: false,
    }));
  }, [systemSettings, userSettings, user]);

  // Обновление системной настройки
  const handleUpdateSystemSetting = useCallback((key: string, value: string) => {
    if (!state.isAdmin) {
      toast({
        title: 'Ошибка доступа',
        description: 'У вас нет прав для изменения системных настроек',
        variant: 'destructive',
      });
      return;
    }
    
    updateSystemSetting(key, value);
  }, [state.isAdmin, updateSystemSetting]);

  // Обновление пользовательской настройки
  const handleUpdateUserSetting = useCallback((key: string, value: string | boolean | number) => {
    updateUserSetting(key, value);
  }, [updateUserSetting]);

  // Сохранение настроек
  const handleSaveSettings = useCallback(async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, saving: true }));
      
      await saveSettings();
      
      toast({
        title: 'Настройки сохранены',
        description: 'Ваши настройки успешно сохранены',
      });
      
      setState(prev => ({ ...prev, saving: false }));
      return true;
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
      
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить настройки',
        variant: 'destructive',
      });
      
      setState(prev => ({ ...prev, saving: false }));
      return false;
    }
  }, [saveSettings]);

  return [
    state,
    {
      updateSystemSetting: handleUpdateSystemSetting,
      updateUserSetting: handleUpdateUserSetting,
      saveSettings: handleSaveSettings,
    },
    activeTab,
    setActiveTab
  ];
}; 