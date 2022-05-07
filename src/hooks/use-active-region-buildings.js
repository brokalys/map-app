import useRegionBuildings from 'src/hooks/api/use-region-buildings';
import useMapContext from 'src/hooks/use-map-context';

function convertBoundsToRegionString(bounds) {
  if (!bounds.ne) return;

  const parts = [
    [bounds.ne.lat, bounds.ne.lng].join(' '),
    [bounds.nw.lat, bounds.nw.lng].join(' '),
    [bounds.sw.lat, bounds.sw.lng].join(' '),
    [bounds.se.lat, bounds.se.lng].join(' '),
    [bounds.ne.lat, bounds.ne.lng].join(' '),
  ];
  return parts.join(', ');
}

export default function useActiveRegionBuildings() {
  const [bounds] = useMapContext();
  const region = convertBoundsToRegionString(bounds);
  return useRegionBuildings(region);
}
