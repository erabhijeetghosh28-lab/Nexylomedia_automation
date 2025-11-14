import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";

type UseQueryOptions<TFilter extends Record<string, unknown>> = {
  search?: string;
  status?: string;
} & TFilter;

type QueryState<TData, TFilter extends Record<string, unknown>> = {
  data: TData | null;
  loading: boolean;
  error: Error | null;
  filter: UseQueryOptions<TFilter>;
};

export const useQuery = <
  TData,
  TFilter extends Record<string, unknown> = Record<string, unknown>,
>(
  fetcher: (filter: UseQueryOptions<TFilter>) => Promise<TData>,
  initialFilter?: UseQueryOptions<TFilter>,
) => {
  const defaultFilter =
    (initialFilter as UseQueryOptions<TFilter>) ?? ({} as UseQueryOptions<TFilter>);

  const [state, setState] = useState<QueryState<TData, TFilter>>({
    data: null,
    loading: true,
    error: null,
    filter: defaultFilter,
  });

  const execute = useCallback(
    async (filter: UseQueryOptions<TFilter>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await fetcher(filter);
        setState((prev) => ({
          ...prev,
          data: result,
          loading: false,
          error: null,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err as Error,
        }));
      }
    },
    [fetcher],
  );

  const debouncedExecute = useMemo(
    () => debounce((filter: UseQueryOptions<TFilter>) => execute(filter), 250),
    [execute],
  );

  useEffect(() => {
    execute(defaultFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFilter = useCallback(
    (updater: (prev: UseQueryOptions<TFilter>) => UseQueryOptions<TFilter>) => {
      setState((prev) => {
        const nextFilter = updater(prev.filter);
        debouncedExecute(nextFilter);
        return { ...prev, filter: nextFilter };
      });
    },
    [debouncedExecute],
  );

  const refetch = useCallback(() => {
    void execute(state.filter);
  }, [execute, state.filter]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    filter: state.filter,
    setFilter,
    refetch,
  };
};


