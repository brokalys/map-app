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
      lat: typeof lat === 'number' ? lat : parseFloat(lat),
      lng: typeof lng === 'number' ? lng : parseFloat(lng),
      zoom: typeof zoom === 'number' ? zoom : parseInt(zoom, 10),
    }),
    [lat, lng, zoom],
  );

  return data;
}
