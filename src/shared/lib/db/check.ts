/**
 * Утилита для проверки подключения к базе данных (FSD)
 */
import { query } from './index';
import { logger } from '../../logger';

/**
 * Проверяет подключение к базе данных и создает необходимые таблицы, если они отсутствуют
 */
export async function initializeDatabase() {
  try {
    logger.info('Checking database connection...');
    
    // Простой запрос для проверки подключения
    await query('SELECT 1');
    
    logger.info('Database connection successful');
    
    // Проверка и создание необходимых таблиц выполняются через миграции
    // В реальном проекте здесь можно добавить проверку и запуск миграций

    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
} 