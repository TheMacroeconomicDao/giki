'use client'

// Simple logger for client-side use
// For client side, we only need a subset of server logger functionality

type LogLevel = "debug" | "info" | "warn" | "error"

interface LogOptions {
	context?: string
	data?: Record<string, any>
}

class ClientLogger {
	private isDevelopment: boolean

	constructor() {
		this.isDevelopment = process.env.NODE_ENV !== "production"
	}

	debug(message: string, options?: LogOptions): void {
		if (!this.isDevelopment) return
		console.debug(`[DEBUG]${options?.context ? ` [${options.context}]` : ''} ${message}`, options?.data || '')
	}

	info(message: string, options?: LogOptions): void {
		console.info(`[INFO]${options?.context ? ` [${options.context}]` : ''} ${message}`, options?.data || '')
	}

	warn(message: string, options?: LogOptions): void {
		console.warn(`[WARN]${options?.context ? ` [${options.context}]` : ''} ${message}`, options?.data || '')
	}

	error(message: string, error?: Error, options?: LogOptions): void {
		console.error(`[ERROR]${options?.context ? ` [${options.context}]` : ''} ${message}`, error || '', options?.data || '')
	}
}

export const clientLogger = new ClientLogger() 