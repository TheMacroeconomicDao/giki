import type { LogLevel, LogOptions } from './index'

class ServerLogger {
	private logLevels: Record<LogLevel, number> = {
		debug: 0,
		info: 1,
		warn: 2,
		error: 3,
	}
	private minLevel: LogLevel = 'debug'

	private shouldLog(level: LogLevel): boolean {
		return this.logLevels[level] >= this.logLevels[this.minLevel]
	}

	private formatMessage(message: string, options?: LogOptions): string {
		const timestamp = new Date().toISOString()
		const level = options?.level || 'info'
		const context = options?.context ? `[${options.context}]` : ''
		return `${timestamp} ${level.toUpperCase()} ${context} ${message}`
	}

	debug(message: string, options?: Omit<LogOptions, 'level'>): void {
		if (!this.shouldLog('debug')) return
		const formattedMessage = this.formatMessage(message, { ...options, level: 'debug' })
		console.debug(formattedMessage, options?.data || '')
	}

	info(message: string, options?: Omit<LogOptions, 'level'>): void {
		if (!this.shouldLog('info')) return
		const formattedMessage = this.formatMessage(message, { ...options, level: 'info' })
		console.info(formattedMessage, options?.data || '')
	}

	warn(message: string, options?: Omit<LogOptions, 'level'>): void {
		if (!this.shouldLog('warn')) return
		const formattedMessage = this.formatMessage(message, { ...options, level: 'warn' })
		console.warn(formattedMessage, options?.data || '')
	}

	error(message: string, error?: Error, options?: Omit<LogOptions, 'level'>): void {
		if (!this.shouldLog('error')) return
		const formattedMessage = this.formatMessage(message, { ...options, level: 'error' })
		console.error(formattedMessage, error || '', options?.data || '')
	}
}

export const serverLogger = new ServerLogger() 