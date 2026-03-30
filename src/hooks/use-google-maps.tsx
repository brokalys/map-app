import { useLoadScript } from '@react-google-maps/api';

export default function useGoogleMaps() {
  return useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY!,
    libraries: ['places'],
  });
}
