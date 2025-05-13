/**
 * Модуль для работы с базой данных (FSD)
 */
import { Pool, QueryResult } from 'pg';
import { logger } from '../logger';

// Определяем недостающие типы для работы с pg

/**
 * Тип клиента БД с необходимыми методами
 */
export interface DbClient {
  query: <T = any>(text: string, values?: any[]) => Promise<QueryResult<T>>;
  release: () => void;
}

// Создание пула подключений к БД
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'giki',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

// Добавляем типизацию к пулу
type PoolWithEvents = Pool & { on: (event: string, callback: (err: Error) => void) => void };

// Обработка событий пула
(pool as PoolWithEvents).on('error', (err: Error) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Выполняет SQL запрос к базе данных
 */
export async function query<T = any>(
  text: string,
  values: any[] = [],
  client?: DbClient
): Promise<QueryResult<T>> {
  const start = Date.now();
  const source = client || pool;
  
  try {
    const res = await source.query<T>(text, values);
    const duration = Date.now() - start;
    
    if (duration > 500) {
      logger.warn(`Slow query (${duration}ms): ${text}`);
    }
    
    return res;
  } catch (error) {
    logger.error(`Query failed: ${text}, values: ${JSON.stringify(values)}`, error);
    throw error;
  }
}

/**
 * Получает клиента из пула подключений
 */
export async function getClient(): Promise<DbClient> {
  // Добавляем кастомный тип, чтобы TypeScript не выдавал ошибку
  return await (pool as unknown as { connect(): Promise<DbClient> }).connect();
}

/**
 * Выполняет транзакцию в базе данных
 */
export async function transaction<T>(
  callback: (client: DbClient) => Promise<T>
): Promise<T> {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Выполняет запрос и возвращает результат первой строки или null
 */
export async function queryOne<T = any>(
  text: string,
  values: any[] = [],
  client?: DbClient
): Promise<T | null> {
  const result = await query<T>(text, values, client);
  return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * Выполняет запрос и возвращает массив результатов
 */
export async function queryAll<T = any>(
  text: string,
  values: any[] = [],
  client?: DbClient
): Promise<T[]> {
  const result = await query<T>(text, values, client);
  return result.rows;
}

// Импортируем новые компоненты
import { QueryBuilder, createQueryBuilder } from './query-builder';
import { queryCache, QueryCacheManager } from './cache-manager';
import { Transactional, TransactionErrorStrategy } from './transaction-manager';

// Реэкспортируем новые компоненты
export { QueryBuilder, createQueryBuilder };
export { queryCache, QueryCacheManager };
export { Transactional, TransactionErrorStrategy };

// Экспорт по умолчанию для обратной совместимости
export default {
  query,
  queryOne,
  queryAll,
  getClient,
  transaction,
  createQueryBuilder,
  queryCache
};