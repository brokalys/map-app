import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export default function useMapCenter() {
  const { lat = 56.94, lng = 24.097, zoom = 15 } = useParams();
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
