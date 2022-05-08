import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function useSetMapCenter() {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (map: google.maps.Map) => {
      const zoom = map.getZoom()!;
      const lat = map.getCenter()!.lat();
      const lng = map.getCenter()!.lng();

      const currentPath = location.pathname;
      const search = location.search;
      const parts = currentPath.split('/');

      let newPath = `/${lat},${lng},${zoom}`;
      if (parts[2] === 'building' && zoom > 14) {
        newPath += `/building/${parts[3]}`;
      }

      if (currentPath.endsWith('/locate-building')) return;
      if (newPath === currentPath) return;

      navigate(newPath + search, { replace: true });
    },
    [location, navigate],
  );
}
