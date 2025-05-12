import { Pool } from 'pg'

// Get the database URL from the environment variables
const DATABASE_URL = process.env.DATABASE_URL || 
                    process.env.POSTGRES_URL ||
                    'postgres://postgres:postgres@localhost:5432/giki'

// Initialize the SQL client
export const pool = new Pool({
  connectionString: DATABASE_URL,
})

// Экспортируем объект sql для совместимости с существующим кодом
export const sql = {
  query: async (queryText: string, params: any[] = []) => {
    const result = await pool.query(queryText, params)
    return result.rows
  }
}