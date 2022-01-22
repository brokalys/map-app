import { gql, useQuery } from '@apollo/client';

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

export default function useRegionBuildings(region) {
  const { loading, data } = useQuery(GET_BUILDINGS, {
    variables: {
      region,
    },
    context: {
      debounceKey: 'GET_BUILDINGS',
    },
  });
  return {
    loading,
    data: data?.bounds?.buildings,
  };
}
