import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  neighborhoodFilterSelector,
  selectedNeighborhoodSelector,
} from 'store/selectors';

const query = gql`
  query ($filters: String!) {
    response(filters: $filters)
      @rest(
        type: "PriceResults"
        method: "GET"
        path: "/stats/monthly?discard=0.1&filters={args.filters}"
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
export default function usePriceData(filterOverrides = {}) {
  const [pollInterval, setPollInterval] = useState(0);
  const { category, type } = useSelector(neighborhoodFilterSelector);
  const { id } = useSelector(selectedNeighborhoodSelector);

  const filters = {
    category,
    type,
    location_classificator: id,
    ...filterOverrides,
  };
  const filterStr = encodeURIComponent(JSON.stringify(filters));

  const { data, loading, error } = useQuery(query, {
    variables: {
      filters: filterStr,
    },
    pollInterval,
  });
  const { loadingResults } = data?.response || {};

  useEffect(() => {
    setPollInterval(() => {
      if (loadingResults === 0) {
        return 0;
      }

      return loadingResults * 200;
    });
  }, [loadingResults]);

  return {
    data: data?.response?.results || [],
    loading: loading || loadingResults > 0,
    error,
  };
}
