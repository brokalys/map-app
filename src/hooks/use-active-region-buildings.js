import { useSelector } from 'react-redux';

import useRegionBuildings from 'src/hooks/api/use-region-buildings';
import { mapRegionSelector } from 'src/store/selectors';

export default function useActiveRegionBuildings() {
  const region = useSelector(mapRegionSelector);
  return useRegionBuildings(region);
}
