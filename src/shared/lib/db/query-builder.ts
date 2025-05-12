/**
 * Модуль для упрощения создания SQL запросов
 */
import { logger } from '../logger';

/**
 * Интерфейс условия Where для QueryBuilder
 */
interface WhereCondition {
  field: string;
  operator: string;
  value: any;
}

/**
 * Интерфейс Join для QueryBuilder
 */
interface JoinClause {
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
  table: string;
  on: {
    leftField: string;
    rightField: string;
  };
}

/**
 * Простой построитель SQL запросов
 */
export class QueryBuilder {
  private table: string = '';
  private selectFields: string[] = ['*'];
  private whereConditions: WhereCondition[] = [];
  private orderByFields: string[] = [];
  private groupByFields: string[] = [];
  private limitValue: number | null = null;
  private offsetValue: number | null = null;
  private joins: JoinClause[] = [];
  private params: any[] = [];

  /**
   * Устанавливает таблицу для запроса
   */
  from(table: string): QueryBuilder {
    this.table = table;
    return this;
  }

  /**
   * Устанавливает поля для выборки
   */
  select(fields: string | string[]): QueryBuilder {
    this.selectFields = Array.isArray(fields) ? fields : [fields];
    return this;
  }

  /**
   * Добавляет условие WHERE
   */
  where(field: string, operator: string, value: any): QueryBuilder {
    this.whereConditions.push({ field, operator, value });
    this.params.push(value);
    return this;
  }

  /**
   * Добавляет условие WHERE с оператором =
   */
  whereEquals(field: string, value: any): QueryBuilder {
    return this.where(field, '=', value);
  }

  /**
   * Добавляет условие WHERE IN
   */
  whereIn(field: string, values: any[]): QueryBuilder {
    const placeholders = values.map((_, index) => `$${this.params.length + index + 1}`).join(', ');
    this.whereConditions.push({ 
      field, 
      operator: 'IN', 
      value: `(${placeholders})` 
    });
    this.params.push(...values);
    return this;
  }

  /**
   * Добавляет JOIN к запросу
   */
  join(
    type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL',
    table: string,
    leftField: string,
    rightField: string
  ): QueryBuilder {
    this.joins.push({
      type,
      table,
      on: {
        leftField,
        rightField
      }
    });
    return this;
  }

  /**
   * Добавляет INNER JOIN
   */
  innerJoin(table: string, leftField: string, rightField: string): QueryBuilder {
    return this.join('INNER', table, leftField, rightField);
  }

  /**
   * Добавляет LEFT JOIN
   */
  leftJoin(table: string, leftField: string, rightField: string): QueryBuilder {
    return this.join('LEFT', table, leftField, rightField);
  }

  /**
   * Устанавливает ORDER BY
   */
  orderBy(fields: string | string[]): QueryBuilder {
    this.orderByFields = Array.isArray(fields) ? fields : [fields];
    return this;
  }

  /**
   * Устанавливает GROUP BY
   */
  groupBy(fields: string | string[]): QueryBuilder {
    this.groupByFields = Array.isArray(fields) ? fields : [fields];
    return this;
  }

  /**
   * Устанавливает LIMIT
   */
  limit(limit: number): QueryBuilder {
    this.limitValue = limit;
    return this;
  }

  /**
   * Устанавливает OFFSET
   */
  offset(offset: number): QueryBuilder {
    this.offsetValue = offset;
    return this;
  }

  /**
   * Строит SQL запрос
   */
  buildQuery(): { sql: string; params: any[] } {
    if (!this.table) {
      throw new Error('Table is not specified');
    }

    let query = `SELECT ${this.selectFields.join(', ')} FROM ${this.table}`;

    // Добавляем JOIN
    if (this.joins.length > 0) {
      this.joins.forEach(join => {
        query += ` ${join.type} JOIN ${join.table} ON ${join.on.leftField} = ${join.on.rightField}`;
      });
    }

    // Добавляем WHERE
    if (this.whereConditions.length > 0) {
      query += ' WHERE ';
      
      query += this.whereConditions.map((condition, index) => {
        if (condition.operator === 'IN') {
          return `${condition.field} IN ${condition.value}`;
        } else {
          return `${condition.field} ${condition.operator} $${index + 1}`;
        }
      }).join(' AND ');
    }

    // Добавляем GROUP BY
    if (this.groupByFields.length > 0) {
      query += ` GROUP BY ${this.groupByFields.join(', ')}`;
    }

    // Добавляем ORDER BY
    if (this.orderByFields.length > 0) {
      query += ` ORDER BY ${this.orderByFields.join(', ')}`;
    }

    // Добавляем LIMIT
    if (this.limitValue !== null) {
      query += ` LIMIT ${this.limitValue}`;
    }

    // Добавляем OFFSET
    if (this.offsetValue !== null) {
      query += ` OFFSET ${this.offsetValue}`;
    }

    return { sql: query, params: this.params };
  }

  /**
   * Вывод отладочной информации о запросе
   */
  debug(): void {
    const { sql, params } = this.buildQuery();
    logger.debug('SQL Query:', sql);
    logger.debug('Params:', params);
  }
}

/**
 * Создает новый экземпляр QueryBuilder
 */
export function createQueryBuilder(): QueryBuilder {
  return new QueryBuilder();
}
