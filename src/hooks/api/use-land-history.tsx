import { gql, useQuery } from '@apollo/client';

import { mapPropertyApiData } from 'src/common/map-api-property-data';
import type { Land } from 'src/types/land';

const GET_LAND_HISTORY = gql`
  query UseLandHistory($id: Int!, $filter: PropertyFilter) {
    land(id: $id) {
      id
      bounds
      properties(filter: $filter) {
        results {
          category
          type
          rent_type
          price
          calc_price_per_sqm
          rooms
          area
          floor_min: floor
          date: published_at
        }
      }
      vzd {
        land {
          date: sale_date
          price
          area: land_total_area_m2
        }
      }
    }
  }
`;

export default function useLandHistory(
  estateId: string,
  { skip = false }: { skip?: boolean } = {},
) {
  const { data, error, loading } = useQuery<{ land: Land }>(GET_LAND_HISTORY, {
    variables: {
      id: Number(estateId),
      filter: {
        category: {
          in: ['land'],
        },
        type: {
          in: ['sell', 'rent', 'auction'],
        },
        price: {
          gt: 1,
        },
      },
    },
    skip,
  });
  return { data: mapVzdData(data?.land), error, loading };
}

function mapVzdData(land: Land | undefined) {
  if (!land) {
    return;
  }

  return mapPropertyApiData(land);
}
