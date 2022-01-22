function mapVzdSalesData(category) {
  return (row) => ({
    ...row,
    source: 'real-sales',
    category,
    type: 'sell',
    calc_price_per_sqm: row.price / row.area,
  });
}

export function mapPropertyApiData(building) {
  return {
    ...building,

    data: [
      ...building.properties.results.map((row) => ({
        ...row,
        source: 'classifieds',
      })),
      ...building.vzd.apartments.map(mapVzdSalesData('apartment')),
      ...building.vzd.premises.map(mapVzdSalesData('office')),
      ...building.vzd.houses.map(mapVzdSalesData('house')),
    ],
  };
}
