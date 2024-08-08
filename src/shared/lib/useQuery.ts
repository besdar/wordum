import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useState} from 'react';

type Props<T> = {
  initialData: T;
  queryFn: () => Promise<T>;
};

export const useQuery = <T>({initialData, queryFn}: Props<T>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(initialData);
  const refetch = useCallback(() => {
    setIsLoading(true);

    queryFn()
      .then(setData)
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(refetch);

  return {data, isLoading, refetch};
};
