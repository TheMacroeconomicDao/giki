import { query, queryOne } from "@/lib/db"
import { logger } from "@/lib/logger"

// Mock users for fallback when database is not available
const mockUsers = {
  "1": {
    id: "1",
    address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    name: "Admin User",
    email: "admin@giki.js",
    role: "admin",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
    preferences: {
      language: "en",
      theme: "system",
      email_notifications: true,
    },
  },
}

// Update the User interface to include avatarUrl
export interface User {
  id: string
  address: string
  name: string | null
  email: string | null
  role: "admin" | "editor" | "viewer"
  created_at: string
  updated_at: string
  last_login: string | null
  avatarUrl?: string | null
  preferences?: {
    language: string
    theme: string
    email_notifications: boolean
  }
}

export interface UserPreferences {
  user_id: string
  language: string
  theme: string
  email_notifications: boolean
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await queryOne<User>(
      `
      SELECT u.*, 
             p.language, 
             p.theme, 
             p.email_notifications
      FROM users u
      LEFT JOIN user_preferences p ON u.id = p.user_id
      WHERE u.id = $1
    `,
      [id],
    )

    if (!user) {
      // Fallback to mock data if database query fails or user not found
      if (mockUsers[id]) {
        return mockUsers[id] as User
      }
      return null
    }

    // Format the user object with preferences
    return {
      ...user,
      preferences: {
        language: user.language || "en",
        theme: user.theme || "system",
        email_notifications: user.email_notifications !== false,
      },
    }
  } catch (error) {
    logger.error("Error getting user by ID:", error as Error)

    // Fallback to mock data if database query fails
    if (mockUsers[id]) {
      return mockUsers[id] as User
    }

    return null
  }
}

export async function getUserByAddress(address: string): Promise<User | null> {
  try {
    const user = await queryOne<User>(
      `
      SELECT u.*, 
             p.language, 
             p.theme, 
             p.email_notifications
      FROM users u
      LEFT JOIN user_preferences p ON u.id = p.user_id
      WHERE LOWER(u.address) = LOWER($1)
    `,
      [address],
    )

    if (!user) return null

    // Format the user object with preferences
    return {
      ...user,
      preferences: {
        language: user.language || "en",
        theme: user.theme || "system",
        email_notifications: user.email_notifications !== false,
      },
    }
  } catch (error) {
    logger.error("Error getting user by address:", error as Error)
    return null
  }
}

export async function createUser(userData: {
  address: string
  name?: string | null
  email?: string | null
  role?: string
}): Promise<User | null> {
  try {
    // Insert the user
    const user = await queryOne<User>(
      `
      INSERT INTO users (address, name, email, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [userData.address, userData.name || null, userData.email || null, userData.role || "viewer"],
    )

    if (!user) return null

    // Create default preferences
    await query(
      `
      INSERT INTO user_preferences (user_id, language, theme, email_notifications)
      VALUES ($1, $2, $3, $4)
    `,
      [user.id, "en", "system", true],
    )

    // Get the complete user with preferences
    return getUserById(user.id)
  } catch (error) {
    logger.error("Error creating user:", error as Error)
    return null
  }
}

// Update the updateUser function to handle avatarUrl
export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  try {
    // Update user data
    if (
      data.name !== undefined ||
      data.email !== undefined ||
      data.role !== undefined ||
      data.avatarUrl !== undefined
    ) {
      const fields = []
      const values = []
      let paramIndex = 1

      if (data.name !== undefined) {
        fields.push(`name = $${paramIndex}`)
        values.push(data.name)
        paramIndex++
      }

      if (data.email !== undefined) {
        fields.push(`email = $${paramIndex}`)
        values.push(data.email)
        paramIndex++
      }

      if (data.role !== undefined) {
        fields.push(`role = $${paramIndex}`)
        values.push(data.role)
        paramIndex++
      }

      if (data.avatarUrl !== undefined) {
        fields.push(`avatar_url = $${paramIndex}`)
        values.push(data.avatarUrl)
        paramIndex++
      }

      fields.push(`updated_at = NOW()`)

      if (fields.length > 0) {
        values.push(id)
        await query(
          `
          UPDATE users
          SET ${fields.join(", ")}
          WHERE id = $${paramIndex}
        `,
          values,
        )
      }
    }

    // Update user preferences if provided
    if (data.preferences) {
      await query(
        `
        INSERT INTO user_preferences (user_id, language, theme, email_notifications)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          language = EXCLUDED.language,
          theme = EXCLUDED.theme,
          email_notifications = EXCLUDED.email_notifications,
          updated_at = NOW()
      `,
        [
          id,
          data.preferences.language || "en",
          data.preferences.theme || "system",
          data.preferences.email_notifications !== false,
        ],
      )
    }

    // Get the updated user
    return getUserById(id)
  } catch (error) {
    logger.error("Error updating user:", error as Error)
    return null
  }
}

export async function updateLastLogin(id: string): Promise<boolean> {
  try {
    await query(
      `
      UPDATE users
      SET last_login = NOW()
      WHERE id = $1
    `,
      [id],
    )
    return true
  } catch (error) {
    logger.error("Error updating last login:", error as Error)
    return false
  }
}

export async function listUsers(
  options: {
    role?: string
    limit?: number
    offset?: number
  } = {},
): Promise<{ users: User[]; total: number }> {
  try {
    const { role, limit = 10, offset = 0 } = options

    // Build the WHERE clause
    let whereClause = ""
    const params: any[] = []

    if (role) {
      whereClause = "WHERE u.role = $1"
      params.push(role)
    }

    // Get total count
    const countResult = await queryOne<{ count: string }>(
      `
      SELECT COUNT(*) as count
      FROM users u
      ${whereClause}
    `,
      params,
    )

    const total = Number.parseInt(countResult?.count || "0", 10)

    // Get users with pagination
    const paginationParams = [...params, limit, offset]
    const users = await query<User>(
      `
      SELECT u.*, 
             p.language, 
             p.theme, 
             p.email_notifications
      FROM users u
      LEFT JOIN user_preferences p ON u.id = p.user_id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `,
      paginationParams,
    )

    // Format users with preferences
    const formattedUsers = users.map((user) => ({
      ...user,
      preferences: {
        language: user.language || "en",
        theme: user.theme || "system",
        email_notifications: user.email_notifications !== false,
      },
    }))

    return { users: formattedUsers, total }
  } catch (error) {
    logger.error("Error listing users:", error as Error)
    return { users: [], total: 0 }
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const result = await query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
    `,
      [id],
    )

    return result.length > 0
  } catch (error) {
    logger.error("Error deleting user:", error as Error)
    return false
  }
}
