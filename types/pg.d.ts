declare module 'pg' {
    export interface QueryResult<T = any> {
      rows: T[];
      rowCount: number;
      command: string;
      oid: number;
      fields: any[];
    }
  
    export class Pool {
      constructor(config?: any);
      query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
      end(): Promise<void>;
    }
  }