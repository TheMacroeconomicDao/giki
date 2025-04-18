import { neon } from "@neondatabase/serverless"

// Get the database URL from the environment variables
// The environment variable name might be different depending on the Neon integration
const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.napi_hztr00ng5ch5vr8vr5d14o9u92tp9h926snonjqxd5uem7z7cwfxtizavqplr85k

// Initialize the SQL client with the Neon connection string
export const sql = neon(DATABASE_URL!)

// Helper function for raw SQL queries
export async function query<T = any>(queryText: string, params: any[] = []): Promise<T[]> {
  try {
    // Use sql.query for conventional function calls with placeholders
    return (await sql.query(queryText, params)) as T[]
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
