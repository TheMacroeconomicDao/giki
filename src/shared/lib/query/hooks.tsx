/**
 * React хуки для работы с кэшированными запросами
 */
// @ts-ignore - игнорируем ошибку с импортом React
import { useState, useEffect, useCallback, useRef } from 'react';
import { queryCache, QueryOptions, CachedData, CacheKey } from './cache';
import { telemetry, TraceMetadata } from '@/shared/lib/telemetry';

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
  hookOptions: { 
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
    async (mutateParams: TParams, 
           mutationContextOptions?: { 
             optimisticData?: TData | ((currentData: TData | null) => TData);
           }
    ) => {
      if (state.isLoading) return;
      
      versionRef.current += 1;
      const currentVersionCapture = versionRef.current;

      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null, 
        isSuccess: false,
        isError: false,
      }));

      // Применяем оптимистичные данные, если они переданы для этого вызова
      if (mutationContextOptions?.optimisticData) {
        const newOptimisticData = typeof mutationContextOptions.optimisticData === 'function'
          ? (mutationContextOptions.optimisticData as (currentData: TData | null) => TData)(state.data)
          : mutationContextOptions.optimisticData;
        setState(prev => ({ ...prev, data: newOptimisticData }));
      }
      
      let traceSpanId: string | undefined;
      try {
        const metadata: Partial<TraceMetadata> = {
          attributes: { params: JSON.stringify(mutateParams) } 
        };
        const mutationName = mutationFn.name || 'unknown_mutation'; 
        traceSpanId = telemetry.startSpan(`query.mutate.${mutationName}`, metadata);
        
        const result = await mutationFn(mutateParams); 
        
        if (currentVersionCapture === versionRef.current) {
          setState({ 
            data: result,
            error: null,
            isLoading: false,
            isSuccess: true,
            isError: false,
          });

          if (hookOptions.onSuccess) {
            await hookOptions.onSuccess(result, mutateParams);
          }
        }
      } catch (err) {
        const typedError = err as TError;
        if (currentVersionCapture === versionRef.current) {
          setState({ 
            data: state.data, 
            error: typedError,
            isLoading: false,
            isSuccess: false,
            isError: true,
          });

          if (hookOptions.onError) {
            await hookOptions.onError(typedError, mutateParams);
          }
        }
      } finally {
        if (traceSpanId) {
          telemetry.endSpan(traceSpanId);
        }
        if (currentVersionCapture === versionRef.current) {
          if (hookOptions.onSettled) {
            const finalData = state.isSuccess ? state.data : null; 
            const finalError = state.isError ? state.error : null; 
            await hookOptions.onSettled(finalData, finalError, mutateParams);
          }
        }
      }
    },
    [mutationFn, hookOptions, state.isLoading, state.data] 
  );
  
  return {
    mutate,
    data: state.data,
    error: state.error,
    isLoading: state.isLoading,
    isSuccess: state.isSuccess,
    isError: state.isError,
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
        if (page === 1) {
          return [...data];
        }
        
        return [...prev, ...data];
      });
    }
  }, [data, status, page]);
  
  // Функция для загрузки следующей страницы
  const fetchNextPage = useCallback(() => {
    if (status === 'loading') return;
    
    if (options.getNextPageParam && data) {
      const nextPage = options.getNextPageParam(data);
      
      if (nextPage !== null) {
        setPage(nextPage);
      }
    } else {
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
