import { useSelector } from 'react-redux';
import useRegionBuildings from 'hooks/api/use-region-buildings';
import { mapRegionSelector } from 'store/selectors';

export default function useActiveRegionBuildings() {
  const region = useSelector(mapRegionSelector);
  return useRegionBuildings(region);
}
