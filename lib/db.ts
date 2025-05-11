// Измените файл lib/db.ts, чтобы вместо Neon использовать node-postgres или другую совместимую библиотеку
import { Pool } from 'pg'

// Get the database URL from the environment variables
const DATABASE_URL = process.env.DATABASE_URL || 
                    process.env.POSTGRES_URL ||
                    'postgres://postgres:postgres@localhost:5432/giki'

// Initialize the SQL client
const pool = new Pool({
  connectionString: DATABASE_URL,
})

// Экспортируем объект sql для совместимости с существующим кодом
export const sql = {
  query: async (queryText: string, params: any[] = []) => {
    const result = await pool.query(queryText, params)
    return result.rows
  }
}

// Методы для работы с базой данных
export async function query<T = any>(queryText: string, params: any[] = []): Promise<T[]> {
  try {
    const result = await pool.query(queryText, params)
    return result.rows as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}


// Helper function for single-row queries
export async function queryOne<T = any>(queryText: string, params: any[] = []): Promise<T | null> {
  try {
    const result = (await sql.query(queryText, params)) as T[]
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function for executing transactions
export async function transaction<T = any>(callback: (client: any) => Promise<T>): Promise<T> {
  try {
    // Note: Neon's serverless driver doesn't support transactions in the same way as a traditional client
    // For now, we'll just execute the callback with the sql client
    return await callback(sql)
  } catch (error) {
    console.error("Transaction error:", error)
    throw error
  }
}
