import type { Building } from 'src/types/building';
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

export function mapPropertyApiData(building: Building) {
  return {
    ...building,

    data: [
      ...building.properties!.results.map((row) => ({
        ...row,
        source: 'classifieds',
        type: row.type === 'office' ? 'premise' : row.type,
      })),
      ...building.vzd!.apartments.map(mapVzdSalesData('apartment')),
      ...building.vzd!.premises.map(mapVzdSalesData('premise')),
      ...building.vzd!.houses.map(mapVzdSalesData('house')),
    ],
  };
}
