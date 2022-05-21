import queryString from 'query-string';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function fixEstateType(type: string) {
  switch (type) {
    case 'land':
    case 'building':
      return type;
  }

  return 'building';
}

export default function useGoToEstate(type: string) {
  const navigate = useNavigate();
  const location = useLocation();
  const normalizedType = fixEstateType(type);

  return useCallback(
    (estateId: string | number) => {
      const path = location.pathname;
      const parts = path.split('/');

      const url = `/${parts[1]}/estate/${normalizedType}/${estateId}`;
      const qs = queryString.stringify(
        { ...queryString.parse(location.search), page: undefined },
        { skipEmptyString: true },
      );

      // Previously the same estate was already active.. navigate back to root page
      if (path === url) {
        navigate(`/${parts[1]}?${qs}`);
        return;
      }

      navigate(`${url}?${qs}`);
    },
    [location, navigate, normalizedType],
  );
}
