import { gql } from '@apollo/client';

import useDebouncedQuery from 'hooks/use-debounced-query';
import useRegionParams from 'hooks/use-region-params';

const GET_MEAN_PRICE = gql`
  query(
    $type: String!
    $date: String!
    $region: [String!]!
    $locations: [String!]
  ) {
    properties(
      filter: {
        type: { eq: $type }
        published_at: { gte: $date }
        location_classificator: { in: $locations }
        region: { in: $region }
      }
    ) {
      summary {
        price(discard: 0.1) {
          mean
        }
      }
    }
  }
`;

export default function useMeanPrice(type, startDate) {
  const { region, locations } = useRegionParams();

  const { loading, error, data } = useDebouncedQuery(
    GET_MEAN_PRICE,
    {
      variables: {
        type: type,
        date: startDate,
        region,
        locations,
      },
    },
    1000,
  );

  return {
    loading: loading || !data,
    error,
    data,
  };
}
