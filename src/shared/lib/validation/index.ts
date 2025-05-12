import { z } from 'zod'

export const userSchema = z.object({
	id: z.string(),
	address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
	name: z.string().nullable(),
	email: z.string().email().nullable(),
	role: z.enum(['admin', 'editor', 'viewer']),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	lastLogin: z.string().datetime().nullable(),
	preferences: z
		.object({
			language: z.string(),
			theme: z.enum(['light', 'dark', 'system']),
			emailNotifications: z.boolean(),
		})
		.optional(),
})

export const createUserSchema = z.object({
	address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
	name: z.string().optional(),
	email: z.string().email().optional(),
	role: z.enum(['admin', 'editor', 'viewer']).default('viewer'),
})

export const updateUserSchema = z.object({
	name: z.string().optional(),
	email: z.string().email().optional(),
	role: z.enum(['admin', 'editor', 'viewer']).optional(),
	preferences: z
		.object({
			language: z.string().optional(),
			theme: z.enum(['light', 'dark', 'system']).optional(),
			emailNotifications: z.boolean().optional(),
		})
		.optional(),
})

export const pageSchema = z.object({
	id: z.string(),
	title: z.string().min(1, 'Title is required'),
	content: z.string(),
	translatedContent: z.record(z.string(), z.string()).optional(),
	visibility: z.enum(['public', 'community', 'private']),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	author: z.object({
		id: z.string(),
		name: z.string().nullable(),
		address: z.string(),
	}),
})

export const createPageSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	content: z.string().min(1, 'Content is required'),
	translatedContent: z.record(z.string(), z.string()).optional(),
	visibility: z.enum(['public', 'community', 'private']),
	author: z.object({
		id: z.string(),
		name: z.string().nullable(),
		address: z.string(),
	}),
})

export const updatePageSchema = z.object({
	title: z.string().min(1, 'Title is required').optional(),
	content: z.string().min(1, 'Content is required').optional(),
	translatedContent: z.record(z.string(), z.string()).optional(),
	visibility: z.enum(['public', 'community', 'private']).optional(),
})

export const settingsSchema = z.object({
	SITE_NAME: z.string(),
	SITE_DESCRIPTION: z.string(),
	OPENAI_API_KEY: z.string().optional(),
	GITHUB_TOKEN: z.string().optional(),
	GITHUB_OWNER: z.string().optional(),
	GITHUB_REPO: z.string().optional(),
	DEFAULT_LANGUAGE: z.string(),
	ALLOWED_LANGUAGES: z.string(),
	ENABLE_PUBLIC_REGISTRATION: z.union([z.boolean(), z.string()]),
	ENABLE_GITHUB_SYNC: z.union([z.boolean(), z.string()]),
	ENABLE_AI_TRANSLATION: z.union([z.boolean(), z.string()]),
})

export const loginSchema = z.object({
	address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
	signature: z.string().optional(),
	message: z.string().optional(),
})

export const verifyTokenSchema = z.object({
	token: z.string(),
}) 