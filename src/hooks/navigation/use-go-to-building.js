import queryString from 'query-string';
import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export default function useGoToBuilding() {
  const history = useHistory();
  const location = useLocation();

  return useCallback(
    (buildingId) => {
      const path = location.pathname;
      const parts = path.split('/');

      let url = `/${parts[1]}/building/${buildingId}`;

      if (parts[2] === 'building' && parts[3] === String(buildingId)) {
        url = `/${parts[1]}`;
      }

      const qs = queryString.stringify(
        { ...queryString.parse(location.search), page: undefined },
        { skipEmptyString: true },
      );

      history.push(`${url}?${qs}`);
    },
    [location, history],
  );
}
