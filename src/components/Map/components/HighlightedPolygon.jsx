import { Polygon } from '@react-google-maps/api';
import { useSelector } from 'react-redux';

import { selectedNeighborhoodSelector } from 'src/store/selectors';

export default function BuildingPolygons() {
  const { region } = useSelector(selectedNeighborhoodSelector);

  return (
    <Polygon
      paths={region.map((polygon) =>
        polygon.map(([lng, lat]) => ({ lng, lat })),
      )}
      options={{ strokeColor: 'black', fillColor: 'black', fillOpacity: 0.2 }}
    />
  );
}
