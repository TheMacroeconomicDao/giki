import type { SearchResult } from '../model/types';
import { Skeleton } from '@/shared/ui/skeleton';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  query: string;
}

export function SearchResults({ results, isLoading, error, query }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Поиск...</h2>
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="space-y-2 p-4 border rounded-md">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <h2 className="text-xl font-semibold">Ошибка поиска</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!query) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="p-4 border rounded-md">
        <h2 className="text-xl font-semibold">По запросу "{query}" ничего не найдено</h2>
        <p className="mt-2 text-gray-600">
          Попробуйте изменить запрос или поискать что-то другое.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Результаты поиска по запросу "{query}" ({results.length})
      </h2>
      
      {results.map((result) => (
        <div key={result.id} className="p-4 border rounded-md hover:border-blue-300 transition-colors">
          <a href={`/pages/${result.id}`} className="block space-y-2">
            <h3 className="text-lg font-medium text-blue-600 hover:underline">
              {result.title}
            </h3>
            
            {result.matchedContext && (
              <p className="text-sm text-gray-700">
                ...{result.matchedContext}...
              </p>
            )}
            
            <div className="flex items-center text-xs text-gray-500 gap-2">
              <span>Автор: {result.author.name}</span>
              <span>•</span>
              <span>
                {new Date(result.updatedAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}
