import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useSuspendableQuery from 'hooks/use-suspended-query';
import {
  neighborhoodFilterSelector,
  selectedNeighborhoodSelector,
} from 'store/selectors';

const query = gql`
  query($filters: String!) {
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
export default function usePriceData({ type: typeOverride } = {}) {
  const [pollInterval, setPollInterval] = useState(0);
  const { category, type } = useSelector(neighborhoodFilterSelector);
  const { id } = useSelector(selectedNeighborhoodSelector);

  const filters = {
    category,
    type: typeOverride || type,
    location_classificator: id,
  };
  const filterStr = encodeURIComponent(JSON.stringify(filters));

  const { data } = useSuspendableQuery(query, {
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

      if (loadingResults <= 2) {
        return 1000;
      }

      return 3000;
    });
  }, [loadingResults]);

  return data.response;
}
