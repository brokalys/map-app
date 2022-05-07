import { Polygon } from '@react-google-maps/api';
import { useMemo } from 'react';

import getRegionData from 'src/common/get-region-data';
import useChartFilters from 'src/hooks/use-price-chart-filters';

export default function BuildingPolygons() {
  const [{ neighborhood }] = useChartFilters();
  const { region = [] } = useMemo(
    () => getRegionData(neighborhood),
    [neighborhood],
  );

  return (
    <Polygon
      paths={region.map((polygon) =>
        polygon.map(([lng, lat]) => ({ lng, lat })),
      )}
      options={{ strokeColor: 'black', fillColor: 'black', fillOpacity: 0.2 }}
    />
  );
}
