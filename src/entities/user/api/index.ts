import { query, queryOne } from '@shared/lib/db'
import { logger } from '@shared/lib/logger'

const mockUsers = {
	'1': {
		id: '1',
		address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
		name: 'Admin User',
		email: 'admin@giki.js',
		role: 'admin',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		last_login: new Date().toISOString(),
		avatarUrl: null,
		preferences: {
			language: 'en',
			theme: 'system',
			email_notifications: true,
		},
	},
}

export interface User {
	id: string
	address: string
	name: string | null
	email: string | null
	role: 'admin' | 'editor' | 'viewer'
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
	avatar_url?: string | null
}

export async function getUserById(id: string): Promise<User | null> {
	try {
		const user = await queryOne<User & UserPreferences>(
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
			if (mockUsers[id]) {
				return mockUsers[id] as User
			}
			return null
		}
		return {
			...user,
			avatarUrl: user.avatar_url || null,
			preferences: {
				language: user.language || 'en',
				theme: user.theme || 'system',
				email_notifications: user.email_notifications !== false,
				avatar_url: user.avatar_url || null,
			},
		}
	} catch (error) {
		logger.error('Error getting user by ID:', error as Error)
		if (mockUsers[id]) {
			return mockUsers[id] as User
		}
		return null
	}
}

export async function getUserByAddress(address: string): Promise<User | null> {
	try {
		const user = await queryOne<User & UserPreferences>(
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
		return {
			...user,
			avatarUrl: user.avatar_url || null,
			preferences: {
				language: user.language || 'en',
				theme: user.theme || 'system',
				email_notifications: user.email_notifications !== false,
				avatar_url: user.avatar_url || null,
			},
		}
	} catch (error) {
		logger.error('Error getting user by address:', error as Error)
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
		const user = await queryOne<User>(
			`
			INSERT INTO users (address, name, email, role)
			VALUES ($1, $2, $3, $4)
			RETURNING *
		`,
			[userData.address, userData.name || null, userData.email || null, userData.role || 'viewer'],
		)
		if (!user) return null
		await query(
			`
			INSERT INTO user_preferences (user_id, language, theme, email_notifications)
			VALUES ($1, $2, $3, $4)
		`,
			[user.id, 'en', 'system', true],
		)
		return getUserById(user.id)
	} catch (error) {
		logger.error('Error creating user:', error as Error)
		return null
	}
}

// ... остальные функции (updateUser, updateLastLogin, listUsers, deleteUser) перенести аналогично ... 