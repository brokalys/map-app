import { gql, useQuery } from '@apollo/client';

const GET_BUILDINGS_AND_PROPERTIES = gql`
  query UseRegionBuildings($region: String!, $filter: PropertyFilter) {
    bounds(bounds: $region) {
      buildings {
        id
        bounds
        properties(filter: $filter) {
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
    variables: {
      region,
      filter: {
        category: {
          in: ['apartment', 'house', 'office'],
        },
        type: {
          in: ['sell', 'rent', 'auction'],
        },
        price: {
          gt: 1,
        },
      },
    },
    context: {
      debounceKey: 'GET_BUILDINGS_AND_PROPERTIES',
    },
  });
  return {
    loading,
    data: data?.bounds?.buildings || [],
  };
}
