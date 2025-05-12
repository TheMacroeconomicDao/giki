/**
 * Хранилище настроек (FSD)
 */
import { create } from 'zustand';
import { DEFAULT_SETTINGS } from './constants';
import type { Settings, SettingKey } from './types';

interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  error: string | null;
  setSettings: (settings: Settings) => void;
  updateSetting: <K extends SettingKey>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  error: null,
  
  setSettings: (settings) => set({ settings }),
  
  updateSetting: (key, value) => set((state) => ({
    settings: {
      ...state.settings,
      [key]: value
    }
  })),
  
  resetSettings: () => set({ settings: DEFAULT_SETTINGS })
})); 