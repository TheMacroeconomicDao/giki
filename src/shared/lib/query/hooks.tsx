/**
 * React хуки для работы с кэшированными запросами
 */
// @ts-ignore - игнорируем ошибку с импортом React
import { useState, useEffect, useCallback, useRef } from 'react';
import { queryCache, QueryOptions, CachedData, CacheKey } from './cache';
import { telemetry } from '@/shared/lib/telemetry';

/**
 * Хук для выполнения запроса с кэшированием
 */
export function useQuery<T, P = void>(
  resource: string,
  fetcher: (params: P) => Promise<T>,
  params: P,
  options: QueryOptions = {}
): CachedData<T> & { refetch: () => Promise<void> } {
  // Ключ кэша
  const key = queryCache.generateKey(resource, params);
  
  // Получаем начальное состояние из кэша или создаем новое
  const getInitialState = (): CachedData<T> => {
    const cached = queryCache.get<T>(key);
    
    if (cached) {
      return cached;
    }
    
    return {
      data: null,
      error: null,
      status: 'idle',
      timestamp: Date.now(),
      stale: false,
      key,
    };
  };
  
  // Состояние запроса
  const [state, setState] = useState<CachedData<T>>(getInitialState);
  
  // Счетчик версии для принудительного обновления
  const versionRef = useRef(0);
  
  // Функция для повторного запроса
  const refetch = useCallback(async () => {
    versionRef.current += 1;
    const currentVersion = versionRef.current;
    
    // Устанавливаем состояние загрузки
    setState(prev => ({
      ...prev,
      status: prev.data ? 'loading' : prev.status,
      stale: true,
    }));
    
    try {
      const result = await queryCache.query(resource, fetcher, params, options);
      
      // Обновляем состояние только если хук все еще смонтирован
      if (currentVersion === versionRef.current) {
        setState(result);
      }
    } catch (error) {
      // Обработка ошибок
      console.error('Query refetch error:', error);
    }
  }, [resource, fetcher, params, options]);
  
  // Эффект для выполнения запроса
  useEffect(() => {
    // Увеличиваем версию при изменении зависимостей
    versionRef.current += 1;
    const currentVersion = versionRef.current;
    
    // Если данных нет или они устарели - запрашиваем
    const cachedData = queryCache.get<T>(key);
    const shouldFetch = !cachedData || 
      queryCache.isStale(cachedData, options) || 
      cachedData.status === 'error';
    
    if (shouldFetch) {
      // Устанавливаем состояние загрузки
      setState(prev => ({
        ...prev,
        status: prev.data ? 'loading' : prev.status,
        stale: true,
      }));
      
      // Запускаем запрос
      const fetchData = async () => {
        try {
          const result = await queryCache.query(resource, fetcher, params, options);
          
          // Обновляем состояние только если хук все еще смонтирован
          if (currentVersion === versionRef.current) {
            setState(result);
          }
        } catch (error) {
          console.error('Query error:', error);
        }
      };
      
      fetchData();
    } else if (cachedData) {
      // Используем данные из кэша
      setState(cachedData);
    }
    
    // Подписка на изменения кэша
    const unsubscribe = queryCache.subscribe(key, () => {
      const newData = queryCache.get<T>(key);
      if (newData && currentVersion === versionRef.current) {
        setState(newData);
      }
    });
    
    // Отписка при размонтировании
    return () => {
      unsubscribe();
    };
  }, [resource, JSON.stringify(params), options.ttl, options.staleWhileRevalidate]);
  
  // Возвращаем состояние и функцию для принудительного обновления
  return { ...state, refetch };
}

/**
 * Хук для мутации данных
 */
export function useMutation<TData, TParams = void, TError = Error>(
  mutationFn: (params: TParams) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, params: TParams) => void | Promise<void>;
    onError?: (error: TError, params: TParams) => void | Promise<void>;
    onSettled?: (data: TData | null, error: TError | null, params: TParams) => void | Promise<void>;
  } = {}
) {
  // Состояние мутации
  const [state, setState] = useState<{
    data: TData | null;
    error: TError | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
  }>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });
  
  // Счетчик версий для отмены устаревших запросов
  const versionRef = useRef(0);
  
  // Функция для выполнения мутации
  const mutate = useCallback(
    async (options: any) => {
      if (state.isLoading) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const metadata: Partial<TraceMetadata> = {
          // Указываем дополнительные метаданные в явном виде
          attributes: { params }
        };
        
        const spanId = telemetry.startSpan(`query.mutate.${cacheKey}`, metadata);
        
        // Если передана функция, вызываем её
        const mutateResult = typeof options?.fn === 'function'
          ? await options.fn(data)
          : undefined;
        
        // Применяем оптимистичные данные, если они переданы
        if (options?.optimisticData) {
          const optimisticData = typeof options.optimisticData === 'function'
            ? options.optimisticData(data)
            : options.optimisticData;
          
          setData(optimisticData);
        }
      } catch (error) {
        // Обработка ошибок
        const typedError = error as TError;
        
        // Проверяем, что хук все еще актуален
        if (currentVersion === versionRef.current) {
          setState({
            data: null,
            error: typedError,
            isLoading: false,
            isSuccess: false,
            isError: true,
          });
          
          // Вызываем колбэк ошибки
          if (options.onError) {
            await options.onError(typedError, params);
          }
          
          // Вызываем колбэк завершения
          if (options.onSettled) {
            await options.onSettled(null, typedError, params);
          }
          
          telemetry.endSpan(spanId, 'error', error instanceof Error ? error : new Error(String(error)));
        }
        
        throw error;
      }
    },
    [mutationFn, options]
  );
  
  // Функция для сброса состояния
  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);
  
  return {
    ...state,
    mutate,
    reset,
  };
}

/**
 * Хук для подписки на кэш запросов
 */
export function useQuerySubscription(key: CacheKey, callback: () => void) {
  useEffect(() => {
    const unsubscribe = queryCache.subscribe(key, callback);
    return () => unsubscribe();
  }, [key, callback]);
}

/**
 * Хук для управления бесконечным списком с пагинацией
 */
export function useInfiniteQuery<TData, TParams>(
  resource: string,
  fetcher: (params: TParams & { page: number }) => Promise<TData[]>,
  params: TParams,
  options: QueryOptions & {
    getNextPageParam?: (lastPage: TData[]) => number | null;
    initialPage?: number;
  } = {}
) {
  // Текущая страница
  const [page, setPage] = useState(options.initialPage || 1);
  
  // Все загруженные данные
  const [allData, setAllData] = useState<TData[]>([]);
  
  // Запрос для текущей страницы
  const { 
    data, 
    status, 
    error, 
    stale, 
    refetch 
  } = useQuery(
    `${resource}:page=${page}`,
    fetcher,
    { ...params, page } as TParams & { page: number },
    options
  );
  
  // Обновляем все данные при получении новой страницы
  useEffect(() => {
    if (data && status === 'success') {
      setAllData(prev => {
        // Если это первая страница, заменяем все данные
        if (page === 1) {
          return [...data];
        }
        
        // Добавляем данные к существующим
        return [...prev, ...data];
      });
    }
  }, [data, status, page]);
  
  // Функция для загрузки следующей страницы
  const fetchNextPage = useCallback(() => {
    if (status === 'loading') return;
    
    // Если есть функция для определения следующей страницы
    if (options.getNextPageParam && data) {
      const nextPage = options.getNextPageParam(data);
      
      if (nextPage !== null) {
        setPage(nextPage);
      }
    } else {
      // По умолчанию просто увеличиваем номер страницы
      setPage(prev => prev + 1);
    }
  }, [status, data, options.getNextPageParam]);
  
  // Функция для полной перезагрузки
  const refresh = useCallback(() => {
    setPage(options.initialPage || 1);
    setAllData([]);
    refetch();
  }, [refetch, options.initialPage]);
  
  return {
    data: allData,
    currentPageData: data,
    status,
    error,
    stale,
    page,
    fetchNextPage,
    hasMoreData: data && data.length > 0,
    isLoading: status === 'loading',
    refresh,
  };
}

export default {
  useQuery,
  useMutation,
  useQuerySubscription,
  useInfiniteQuery,
};
