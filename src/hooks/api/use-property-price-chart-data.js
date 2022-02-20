import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  neighborhoodFilterSelector,
  selectedNeighborhoodSelector,
} from 'src/store/selectors';

const query = gql`
  query (
    $start: String!
    $discard: Number!
    $filters: String!
    $source: String!
  ) {
    response(
      start: $start
      discard: $discard
      filters: $filters
      source: $source
    )
      @rest(
        type: "PriceResults"
        method: "GET"
        path: "/stats/monthly?start_datetime={args.start}&discard={args.discard}&filters={args.filters}&source={args.source}"
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
  const { category, type, source } = useSelector(neighborhoodFilterSelector);
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
      start: source === 'classifieds' ? '2018-01-01' : '2013-01-01',
      discard: source === 'classifieds' ? 0.1 : 0,
      filters: filterStr,
      source,
    },
    pollInterval,
  });
  const { loadingResults } = data?.response || {};

  useEffect(() => {
    setPollInterval(loadingResults * 200);
  }, [loadingResults]);

  return {
    data: data?.response?.results || [],
    loading: loading || loadingResults > 0,
    error,
  };
}
