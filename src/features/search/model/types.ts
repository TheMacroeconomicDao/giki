/**
 * Результат поиска
 */
export interface SearchResult {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  updatedAt: string;
  score: number;
  matchedContext?: string;
}

/**
 * Параметры поиска
 */
export interface SearchParams {
  query: string;
  limit?: number;
  offset?: number;
  filter?: {
    authorId?: string;
    tags?: string[];
    dateFrom?: string;
    dateTo?: string;
  };
}
