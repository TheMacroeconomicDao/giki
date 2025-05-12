import { pool, sql } from './connection'

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