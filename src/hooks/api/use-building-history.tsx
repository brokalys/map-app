import { gql, useQuery } from '@apollo/client';

import { mapPropertyApiData } from 'src/common/map-api-property-data';
import type { Building } from 'src/types/building';

const GET_SINGLE_BUILDING = gql`
  query UseBuildingHistory($id: Int!, $filter: PropertyFilter) {
    building(id: $id) {
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
        apartments {
          date: sale_date
          price
          floor_min: space_group_lowest_floor
          floor_max: space_group_highest_floor
          area: apartment_total_area_m2
          rooms: room_count
        }
        premises {
          date: sale_date
          price
          floor_min: space_group_lowest_floor
          floor_max: space_group_highest_floor
          area: space_group_total_area_m2
          rooms: space_count_in_space_group
        }
        houses {
          date: sale_date
          price
          floor_min: building_overground_floors
          area: building_total_area_m2
        }
      }
    }
  }
`;

export default function useBuildingHistory(
  estateId: string,
  { skip = false }: { skip?: boolean } = {},
) {
  const { data, error, loading } = useQuery<{ building: Building }>(
    GET_SINGLE_BUILDING,
    {
      variables: {
        id: Number(estateId),
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
      skip,
    },
  );
  return { data: mapVzdData(data?.building), error, loading };
}

function mapVzdData(building: Building | undefined) {
  if (!building) {
    return;
  }

  return mapPropertyApiData(building);
}
