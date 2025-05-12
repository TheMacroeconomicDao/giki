/**
 * Расширенные возможности для работы с транзакциями
 */
import { DbClient, transaction } from './index';
import { logger } from '../logger';

/**
 * Типы стратегий обработки ошибок транзакций
 */
export enum TransactionErrorStrategy {
  ROLLBACK_AND_THROW = 'rollback_and_throw',
  ROLLBACK_AND_RETURN_NULL = 'rollback_and_return_null',
  RETRY = 'retry',
}

/**
 * Опции транзакции
 */
export interface TransactionOptions {
  /**
   * Максимальное количество попыток выполнить транзакцию при ошибках
   */
  maxRetries?: number;
  
  /**
   * Стратегия обработки ошибок
   */
  errorStrategy?: TransactionErrorStrategy;
  
  /**
   * Время ожидания между попытками (мс)
   */
  retryDelayMs?: number;
}

/**
 * Декоратор для методов, чтобы автоматически выполнять их в транзакции
 */
export function Transactional(options: TransactionOptions = {}) {
  const {
    maxRetries = 3,
    errorStrategy = TransactionErrorStrategy.ROLLBACK_AND_THROW,
    retryDelayMs = 100,
  } = options;

  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      let retries = 0;
      
      const executeTransaction = async (): Promise<any> => {
        try {
          return await transaction(async (client: DbClient) => {
            // Добавляем клиент как последний аргумент метода
            return await originalMethod.apply(this, [...args, client]);
          });
        } catch (error) {
          // Логируем ошибку
          logger.error(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          
          // Обрабатываем ошибку в зависимости от выбранной стратегии
          if (errorStrategy === TransactionErrorStrategy.ROLLBACK_AND_RETURN_NULL) {
            return null;
          } else if (errorStrategy === TransactionErrorStrategy.RETRY) {
            if (retries < maxRetries) {
              retries++;
              logger.info(`Retrying transaction (${retries}/${maxRetries})...`);
              await new Promise(resolve => setTimeout(resolve, retryDelayMs));
              return executeTransaction();
            }
          }
          
          // По умолчанию пробрасываем ошибку
          throw error;
        }
      };
      
      return executeTransaction();
    };

    return descriptor;
  };
}
