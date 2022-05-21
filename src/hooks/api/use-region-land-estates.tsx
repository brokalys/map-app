import { gql, useQuery } from '@apollo/client';

import type { Land } from 'src/types/land';

const GET_LAND = gql`
  query UseRegionLandProperties($region: String!) {
    bounds(bounds: $region) {
      land {
        id
        bounds
      }
    }
  }
`;

export default function useRegionLandEstates(
  region: string,
  { skip = false }: { skip?: boolean } = {},
) {
  const { loading, error, data } = useQuery<{
    bounds?: { land: Land[] };
  }>(GET_LAND, {
    variables: {
      region,
    },
    context: {
      debounceKey: 'GET_LAND',
    },
    skip,
  });

  return {
    loading,
    data: error ? [] : data?.bounds?.land || [],
    error,
  };
}
