/**
 * Модуль для работы с базой данных (FSD)
 */
import { Pool, PoolClient, QueryResult } from 'pg';
import { logger } from '../../logger';

// Создание пула подключений к БД
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'giki',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

// Обработка событий пула
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Выполняет SQL запрос к базе данных
 */
export async function query<T = any>(
  text: string,
  values: any[] = [],
  client?: PoolClient
): Promise<QueryResult<T>> {
  const start = Date.now();
  const source = client || pool;
  
  try {
    const res = await source.query(text, values);
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
export async function getClient(): Promise<PoolClient> {
  return await pool.connect();
}

/**
 * Выполняет транзакцию в базе данных
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  
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

export default {
  query,
  getClient,
  transaction,
}; 