export function mapPropertyApiData(building) {
  return {
    ...building,

    data: [
      ...building.properties.results.map((row) => ({
        ...row,
        source: 'classifieds',
      })),
      ...building.vzd.apartments.map((row) => ({
        ...row,
        source: 'real-sales',
        category: 'apartment',
        type: 'sell',
        calc_price_per_sqm: row.price / row.area,
      })),
      ...building.vzd.premises.map((row) => ({
        ...row,
        source: 'real-sales',
        category: 'premise',
        type: 'sell',
        calc_price_per_sqm: row.price / row.area,
      })),
      ...building.vzd.houses.map((row) => ({
        ...row,
        source: 'real-sales',
        category: 'house',
        type: 'sell',
        calc_price_per_sqm: row.price / row.area,
      })),
    ],
  };
}
