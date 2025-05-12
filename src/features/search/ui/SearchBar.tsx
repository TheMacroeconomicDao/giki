import { useState, useCallback } from 'react';
import { useSearch } from '../model/useSearch';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Search as SearchIcon } from 'lucide-react';

/**
 * Компонент поисковой строки с автодополнением
 */
export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { search, isLoading, suggestions } = useSearch();
  
  const handleSearch = useCallback(() => {
    if (query.trim()) {
      search(query);
    }
  }, [query, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <Input
          className="flex-1"
          placeholder="Искать в вики..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleSearch}
          disabled={isLoading}
          className="ml-2"
        >
          <SearchIcon className="h-4 w-4" />
        </Button>
      </div>
      
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 border rounded-md bg-white shadow-lg">
          <ul className="py-1">
            {suggestions.map((suggestion) => (
              <li 
                key={suggestion.id} 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => window.location.href = `/pages/${suggestion.id}`}
              >
                {suggestion.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
