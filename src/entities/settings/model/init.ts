/**
 * Инициализация настроек приложения (FSD)
 */
import { query } from '@/shared/lib/db';
import { logger } from '@/shared/lib/logger';
import { DEFAULT_SETTINGS } from './constants';

/**
 * Инициализирует настройки приложения
 */
export async function initializeSettings(): Promise<void> {
  try {
    logger.info('Initializing settings...');

    // Проверяем, существует ли таблица settings
    const { rows } = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'settings'
      );
    `);

    const tableExists = rows[0]?.exists;

    if (!tableExists) {
      logger.info('Creating settings table...');
      
      // Создаем таблицу settings
      await query(`
        CREATE TABLE settings (
          key VARCHAR(255) PRIMARY KEY,
          value JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
    }

    // Проверяем, есть ли необходимые настройки по умолчанию
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      const { rows } = await query(
        'SELECT key FROM settings WHERE key = $1',
        [key]
      );

      if (rows.length === 0) {
        logger.info(`Adding default setting: ${key}`);
        
        await query(
          'INSERT INTO settings (key, value) VALUES ($1, $2)',
          [key, JSON.stringify(value)]
        );
      }
    }

    logger.info('Settings initialized successfully');
  } catch (error) {
    logger.error('Settings initialization error:', error);
    throw error;
  }
} 