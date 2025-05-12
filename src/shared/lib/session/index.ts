// TODO: Перенести сюда код из lib/session-service.ts 
import { query, queryOne } from '@shared/lib/db'
import { logger } from '@shared/lib/logger'

export interface Session {
	id: string
	user_id: string
	refresh_token: string
	user_agent: string | null
	ip_address: string | null
	is_active: boolean
	created_at: string
	last_active: string
	expires_at: string
}

export async function createSession(sessionData: {
	user_id: string
	refresh_token: string
	user_agent?: string
	ip_address?: string
	expires_at: Date
}): Promise<Session | null> {
	try {
		const session = await queryOne<Session>(
			`
			INSERT INTO sessions (
				user_id, 
				refresh_token, 
				user_agent, 
				ip_address, 
				expires_at
			)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING *
		`,
			[
				sessionData.user_id,
				sessionData.refresh_token,
				sessionData.user_agent || null,
				sessionData.ip_address || null,
				sessionData.expires_at.toISOString(),
			],
		)
		return session
	} catch (error) {
		logger.error('Error creating session:', error as Error)
		return null
	}
}

export async function getSessionByToken(refreshToken: string): Promise<Session | null> {
	try {
		const session = await queryOne<Session>(
			`
			SELECT *
			FROM sessions
			WHERE refresh_token = $1 AND is_active = true AND expires_at > NOW()
		`,
			[refreshToken],
		)
		return session
	} catch (error) {
		logger.error('Error getting session by token:', error as Error)
		return null
	}
}

export async function getUserSessions(userId: string): Promise<Session[]> {
	try {
		const sessions = await query<Session>(
			`
			SELECT *
			FROM sessions
			WHERE user_id = $1 AND is_active = true
			ORDER BY last_active DESC
		`,
			[userId],
		)
		return sessions
	} catch (error) {
		logger.error('Error getting user sessions:', error as Error)
		return []
	}
}

export async function updateSessionActivity(id: string): Promise<boolean> {
	try {
		await query(
			`
			UPDATE sessions
			SET last_active = NOW()
			WHERE id = $1
		`,
			[id],
		)
		return true
	} catch (error) {
		logger.error('Error updating session activity:', error as Error)
		return false
	}
}

export async function deactivateSession(id: string): Promise<boolean> {
	try {
		await query(
			`
			UPDATE sessions
			SET is_active = false
			WHERE id = $1
		`,
			[id],
		)
		return true
	} catch (error) {
		logger.error('Error deactivating session:', error as Error)
		return false
	}
}

export async function deactivateAllUserSessions(userId: string): Promise<boolean> {
	try {
		await query(
			`
			UPDATE sessions
			SET is_active = false
			WHERE user_id = $1
		`,
			[userId],
		)
		return true
	} catch (error) {
		logger.error('Error deactivating all user sessions:', error as Error)
		return false
	}
}

export async function cleanupExpiredSessions(): Promise<number> {
	try {
		const result = await query<{ count: string }>(`
			UPDATE sessions
			SET is_active = false
			WHERE expires_at < NOW() AND is_active = true
			RETURNING COUNT(*) as count
		`)
		return Number.parseInt(result[0]?.count || '0', 10)
	} catch (error) {
		logger.error('Error cleaning up expired sessions:', error as Error)
		return 0
	}
} 