/**
 * Модуль логирования (FSD)
 */

// В реальном проекте можно использовать библиотеки как winston, pino и др.
// Здесь реализуем простой логгер с обертками над console

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Форматирует сообщение для логирования
 */
function formatMessage(message: string): string {
	const timestamp = new Date().toISOString();
	return `[${timestamp}] ${message}`;
}

/**
 * Логирует информационное сообщение
 */
function info(message: string, ...args: any[]): void {
	console.info(formatMessage(message), ...args);
}

/**
 * Логирует предупреждение
 */
function warn(message: string, ...args: any[]): void {
	console.warn(formatMessage(message), ...args);
}

/**
 * Логирует ошибку
 */
function error(message: string, ...args: any[]): void {
	console.error(formatMessage(message), ...args);
}

/**
 * Логирует отладочную информацию (только в dev режиме)
 */
function debug(message: string, ...args: any[]): void {
	if (isDev) {
		console.debug(formatMessage(message), ...args);
	}
}

export const logger = {
	info,
	warn,
	error,
	debug,
};

export * from './server'
export * from './client' 