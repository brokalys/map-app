import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

const INITIAL_CENTER = {
  lat: 56.94734440635773,
  lng: 24.105604143682786,
  zoom: 13,
};

export default function useMapCenter() {
  const {
    lat = INITIAL_CENTER.lat,
    lng = INITIAL_CENTER.lng,
    zoom = INITIAL_CENTER.zoom,
  } = useParams();

  const data = useMemo(
    () => ({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      zoom: parseInt(zoom, 10),
    }),
    [lat, lng, zoom],
  );

  return data;
}
