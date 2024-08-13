import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {
  DefaultError,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryKey,
  useQuery as tanstackUseQuery,
} from '@tanstack/react-query';

export const useQuery = <
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  props: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
): DefinedUseQueryResult<TData, TError> => {
  const {refetch, ...returnValues} = tanstackUseQuery(props);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  return {...returnValues, refetch};
};
