import { useEffect, useState } from 'react';
import { useDebounce, useDebouncedCallback } from 'use-debounce';
import { useLazyQuery } from '@apollo/client';

export default function useDebouncedQuery(query, nextConfig, time = 1000) {
  const nextConfigStr = JSON.stringify(nextConfig);
  const [debouncedIsLoading, setDebouncedLoading] = useState(false);
  const [previousData, setPreviousData] = useState(undefined);
  const [config] = useDebounce(nextConfig, time, {
    equalityFn: (prev, next) => JSON.stringify(prev) === JSON.stringify(next),
  });

  const [performLazyQuery, { loading, data }] = useLazyQuery(query, config);
  const [performDebouncedQuery] = useDebouncedCallback(() => {
    performLazyQuery();
  }, time);

  useEffect(() => {
    setDebouncedLoading(true);
    performDebouncedQuery();
  }, [nextConfigStr, performDebouncedQuery]);


  useEffect(() => {
    if (loading === false) {
      setDebouncedLoading(false);
      setPreviousData(data);
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    loading: loading || debouncedIsLoading,
    data: data || previousData,
  };
}
