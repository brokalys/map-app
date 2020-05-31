import { useContext, useMemo } from 'react';
import polygonsOverlapping from 'polygon-overlap';

import MapContext from 'context/MapContext';
import rigaGeojson from 'data/riga-geojson.json';

export default function useRegionParams() {
  const map = useContext(MapContext);
  const regionPolygon = useMemo(() => {
    return [
      [map.bounds.nw.lng, map.bounds.nw.lat],
      [map.bounds.ne.lng, map.bounds.ne.lat],
      [map.bounds.sw.lng, map.bounds.sw.lat],
      [map.bounds.se.lng, map.bounds.se.lat],
    ];
  }, [map.bounds]);

  const locations = useMemo(() => {
    return rigaGeojson.features
      .filter((feature) =>
        polygonsOverlapping(feature.geometry.coordinates[0], regionPolygon)
      )
      .map((feature) => `latvia-riga-${feature.properties.id}`);
  }, [regionPolygon]);

  return {
    region: [map.region],
    locations: locations.length > 10 ? undefined : locations,
  };
}
