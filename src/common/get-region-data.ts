import { latvia, riga } from '@brokalys/location-json-schemas';
import type {
  LatviaGeoJsonFeature,
  RigaGeoJsonFeature,
} from '@brokalys/location-json-schemas';

const highlightedRegionRigaMap = riga.features.reduce<
  Record<string, RigaGeoJsonFeature>
>((carry, row) => ({ ...carry, [row.properties.id]: row }), {});
const highlightedRegionLatviaMap = latvia.features.reduce<
  Record<string, LatviaGeoJsonFeature>
>((carry, row) => ({ ...carry, [row.properties.id]: row }), {});

function getCenterCoords(arr: Array<GeoJSON.Position>) {
  const coords = arr.reduce(
    (x, y) => [x[0] + y[0] / arr.length, x[1] + y[1] / arr.length],
    [0, 0],
  );

  return { lat: coords[1], lng: coords[0] };
}

export default function getRegionData(id: string) {
  if (highlightedRegionRigaMap[id]) {
    const data = highlightedRegionRigaMap[id];
    return {
      ...data,
      name: data.properties.name,
      region: data.geometry.coordinates,
      centerCoords: getCenterCoords(data.geometry.coordinates[0]),
    };
  }

  const data = highlightedRegionLatviaMap[id];

  if (!data) {
    return;
  }

  return {
    ...data,
    name: data.properties.name,
    region: data.geometry.coordinates[0],
    centerCoords: getCenterCoords(data.geometry.coordinates[0][0]),
  };
}
