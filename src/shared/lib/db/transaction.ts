import { pool, sql } from './connection'

// Helper function for executing transactions
export async function transaction<T = any>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    const result = await callback(client)
    
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    console.error("Transaction error:", error)
    throw error
  } finally {
    client.release()
  }
} 