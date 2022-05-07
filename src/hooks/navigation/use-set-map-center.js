import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export default function useSetMapCenter() {
  const history = useHistory();
  const location = useLocation();

  return useCallback(
    (map) => {
      const zoom = map.getZoom();
      const currentPath = location.pathname;
      const search = location.search;
      const parts = currentPath.split('/');

      let newPath = `/${map.center.lat()},${map.center.lng()},${zoom}`;
      if (parts[2] === 'building' && zoom > 14) {
        newPath += `/building/${parts[3]}`;
      }

      if (currentPath.endsWith('/locate-building')) return;
      if (newPath === currentPath) return;

      history.replace(newPath + search);
    },
    [location, history],
  );
}
