import useRegionBuildingEstates from 'src/hooks/api/use-region-building-estates';
import useRegionLandEstates from 'src/hooks/api/use-region-land-estates';
import useEstateTypeFilter from 'src/hooks/use-estate-type-filter';
import useMapContext from 'src/hooks/use-map-context';

interface LatLng {
  lat: number;
  lng: number;
}

function convertBoundsToRegionString(bounds: {
  ne?: LatLng;
  nw?: LatLng;
  sw?: LatLng;
  se?: LatLng;
}) {
  if (!bounds.ne || !bounds.nw || !bounds.sw || !bounds.se) {
    return '';
  }

  const parts = [
    [bounds.ne.lat, bounds.ne.lng].join(' '),
    [bounds.nw.lat, bounds.nw.lng].join(' '),
    [bounds.sw.lat, bounds.sw.lng].join(' '),
    [bounds.se.lat, bounds.se.lng].join(' '),
    [bounds.ne.lat, bounds.ne.lng].join(' '),
  ];
  return parts.join(', ');
}

export default function useActiveRegionEstates() {
  const [estateType] = useEstateTypeFilter();
  const [bounds] = useMapContext();
  const region = convertBoundsToRegionString(bounds);
  const isLandType = estateType === 'land';

  const {
    loading: buildingsLoading,
    data: buildingsData,
    error: buildingsError,
  } = useRegionBuildingEstates(region, { skip: isLandType });
  const {
    loading: landLoading,
    data: landData,
    error: landError,
  } = useRegionLandEstates(region, { skip: !isLandType });

  if (isLandType) {
    return {
      type: estateType,
      loading: landLoading,
      data: landData,
      error: landError,
    };
  }

  return {
    type: estateType,
    loading: buildingsLoading,
    data: buildingsData,
    error: buildingsError,
  };
}
