import { gql, useQuery } from '@apollo/client';

import type { Building } from 'src/types/building';

const GET_BUILDINGS = gql`
  query UseRegionBuildings($region: String!) {
    bounds(bounds: $region) {
      buildings {
        id
        bounds
      }
    }
  }
`;

export default function useRegionBuildingEstates(
  region: string,
  { skip = false }: { skip?: boolean } = {},
) {
  const { loading, error, data } = useQuery<{
    bounds?: { buildings: Building[] };
  }>(GET_BUILDINGS, {
    variables: {
      region,
    },
    context: {
      debounceKey: 'GET_BUILDINGS',
    },
    skip,
  });

  return {
    loading,
    data: error ? [] : data?.bounds?.buildings || [],
    error,
  };
}
