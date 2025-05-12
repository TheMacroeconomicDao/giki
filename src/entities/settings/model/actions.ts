/**
 * Действия для работы с настройками (FSD)
 */
import { query } from '@/shared/lib/db';
import { logger } from '@/shared/lib/logger';
import { DEFAULT_SETTINGS } from './constants';
import type { SettingKey, Settings } from './types';

/**
 * Получает все настройки из базы данных
 */
export async function getAllSettings(): Promise<Settings> {
  try {
    const { rows } = await query('SELECT key, value FROM settings');

    // Преобразуем результат в объект настроек
    const settings = { ...DEFAULT_SETTINGS };

    for (const row of rows) {
      const key = row.key as SettingKey;
      settings[key] = row.value;
    }

    return settings;
  } catch (error) {
    logger.error('Failed to get settings:', error);
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Получает настройку по ключу
 */
export async function getSetting<K extends SettingKey>(key: K): Promise<Settings[K]> {
  try {
    const { rows } = await query('SELECT value FROM settings WHERE key = $1', [key]);

    if (rows.length === 0) {
      return DEFAULT_SETTINGS[key];
    }

    return rows[0].value;
  } catch (error) {
    logger.error(`Failed to get setting ${key}:`, error);
    return DEFAULT_SETTINGS[key];
  }
}

/**
 * Обновляет настройку по ключу
 */
export async function updateSetting<K extends SettingKey>(
  key: K,
  value: Settings[K]
): Promise<void> {
  try {
    const { rowCount } = await query(
      `
      INSERT INTO settings (key, value, updated_at) 
      VALUES ($1, $2, NOW()) 
      ON CONFLICT (key) 
      DO UPDATE SET value = $2, updated_at = NOW()
      `,
      [key, JSON.stringify(value)]
    );

    logger.info(`Updated setting ${key}: ${rowCount} row(s) affected`);
  } catch (error) {
    logger.error(`Failed to update setting ${key}:`, error);
    throw error;
  }
}

/**
 * Обновляет несколько настроек одновременно
 */
export async function updateSettings(
  settings: Partial<Settings>
): Promise<void> {
  try {
    for (const [key, value] of Object.entries(settings)) {
      await updateSetting(key as SettingKey, value);
    }
  } catch (error) {
    logger.error('Failed to update settings:', error);
    throw error;
  }
} 