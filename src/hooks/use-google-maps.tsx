import { useLoadScript } from '@react-google-maps/api';

export default function useGoogleMaps() {
  return useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY!,
    libraries: ['places'],
  });
}
