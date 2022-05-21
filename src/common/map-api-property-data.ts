import type { Building } from 'src/types/building';
import type { Land } from 'src/types/land';
import type { VZDProperty } from 'src/types/vzd';

function mapVzdSalesData(category: string) {
  return (row: VZDProperty) => ({
    ...row,
    source: 'real-sales',
    category,
    type: 'sell',
    calc_price_per_sqm: row.price / row.area,
  });
}

export function mapPropertyApiData(estate: Building | Land) {
  return {
    ...estate,

    data: [
      ...estate.properties!.results.map((row) => ({
        ...row,
        source: 'classifieds',
        type: row.type === 'office' ? 'premise' : row.type,
      })),
      ...('apartments' in estate.vzd!
        ? estate.vzd!.apartments.map(mapVzdSalesData('apartment'))
        : []),
      ...('premises' in estate.vzd!
        ? estate.vzd!.premises.map(mapVzdSalesData('premise'))
        : []),
      ...('houses' in estate.vzd!
        ? estate.vzd!.houses.map(mapVzdSalesData('house'))
        : []),
      ...('land' in estate.vzd!
        ? estate.vzd!.land.map(mapVzdSalesData('house'))
        : []),
    ],
  };
}
