import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchApi } from '../api/searchApi';
import type { SearchResult } from './types';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Получение автодополнений при вводе
  useEffect(() => {
    const getSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const data = await searchApi.getSearchSuggestions(query);
        setSuggestions(data);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };

    const debounceTimeout = setTimeout(getSuggestions, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  // Функция поиска
  const search = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setQuery(searchQuery);

    try {
      const data = await searchApi.search(searchQuery);
      setResults(data);
      
      // Переходим на страницу результатов
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при поиске');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    query,
    results,
    suggestions,
    isLoading,
    error,
    search,
    setQuery
  };
}
