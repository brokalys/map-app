import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import useChartFilters from 'src/hooks/use-price-chart-filters';

const query = gql`
  query (
    $start: String!
    $discard: Number!
    $filters: String!
    $source: String!
    $period: String!
  ) {
    response(
      start: $start
      discard: $discard
      filters: $filters
      source: $source
      period: $period
    )
      @rest(
        type: "PriceResults"
        method: "GET"
        path: "/stats/monthly?start_datetime={args.start}&discard={args.discard}&filters={args.filters}&source={args.source}&period={args.period}"
      ) {
      loadingResults
      results {
        count
        start_datetime
        end_datetime
        price {
          min
          max
          median
          mean
          mode
        }
        pricePerSqm {
          min
          max
          median
          mean
          mode
        }
      }
    }
  }
`;

export interface PriceResult {
  count: number;
  start_datetime: string;
  end_datetime: string;
  price: {
    min: number;
    max: number;
    median: number;
    mean: number;
    mode: number;
  };
  pricePerSqm: {
    min: number;
    max: number;
    median: number;
    mean: number;
    mode: number;
  };
}

export default function usePriceData(filterOverrides = {}) {
  const [pollInterval, setPollInterval] = useState(0);
  const [{ category, type, source, neighborhood }] = useChartFilters();

  const filters = {
    category,
    type,
    location_classificator: neighborhood,
    ...filterOverrides,
  };
  const filterStr = encodeURIComponent(JSON.stringify(filters));

  const { data, loading, error } = useQuery<{
    response?: { loadingResults: number; results?: PriceResult[] };
  }>(query, {
    variables: {
      start: source === 'classifieds' ? '2018-01-01' : '2013-01-01',
      discard: source === 'classifieds' ? 0.1 : 0,
      filters: filterStr,
      source,
      period: source === 'classifieds' ? 'month' : 'quarter',
    },
    pollInterval,
  });
  const { loadingResults = 0 } = data?.response || {};

  useEffect(() => {
    setPollInterval(() => {
      if (error || loadingResults <= 0) {
        return 0;
      }

      if (loadingResults > 5) {
        return loadingResults * 200;
      }

      return 1000;
    });
  }, [loadingResults, error]);

  return {
    data: data?.response?.results || [],
    loading: loading || loadingResults > 0,
    loadingState: {
      totalResults: loadingResults + (data?.response?.results?.length || 0),
      loadingResults,
    },
    error,
  };
}
