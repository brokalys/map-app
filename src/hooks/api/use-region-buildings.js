import { gql, useQuery } from '@apollo/client';

const GET_BUILDINGS_AND_PROPERTIES = gql`
  query($region: String!) {
    bounds(bounds: $region) {
      buildings {
        id
        bounds
        properties {
          results {
            category
            type
            rent_type
            price
            price_per_sqm
            rooms
            area
            floor
            published_at
          }
        }
      }
    }
  }
`;

export default function useRegionBuildings(region) {
  const { loading, data } = useQuery(GET_BUILDINGS_AND_PROPERTIES, {
    variables: { region },
    context: {
      debounceKey: 'GET_BUILDINGS_AND_PROPERTIES',
    },
  });
  return {
    loading,
    data: data?.bounds?.buildings || [],
  };
}
