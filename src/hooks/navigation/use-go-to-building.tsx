import queryString from 'query-string';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function useGoToBuilding() {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (buildingId: string | number) => {
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

      navigate(`${url}?${qs}`);
    },
    [location, navigate],
  );
}
