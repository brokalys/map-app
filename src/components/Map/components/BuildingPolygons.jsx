import { Polygon } from '@react-google-maps/api';

import useActiveBuilding from 'hooks/use-active-building';
import useRegionBuildings from 'hooks/api/use-region-buildings';

export default function BuildingPolygons() {
  const [activeBuilding, setActiveBuilding] = useActiveBuilding();
  const { data: buildings } = useRegionBuildings();

  const onBuildingClick = (building) => {
    setActiveBuilding(building === activeBuilding ? undefined : building);
  };

  return buildings
    .filter(({ properties }) => properties.results.length > 0)
    .map((building) => (
      <Polygon
        key={building.id}
        onClick={() => onBuildingClick(building)}
        paths={building.bounds.split(', ').map((row) => {
          const [lat, lng] = row.split(' ');
          return { lat: parseFloat(lat), lng: parseFloat(lng) };
        })}
        options={
          activeBuilding && activeBuilding.id === building.id
            ? { strokeColor: 'green', fillColor: 'green' }
            : { strokeColor: 'black', fillColor: 'black' }
        }
      />
    ));
}
