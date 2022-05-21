import { useParams } from 'react-router-dom';

import useBuildingHistory from 'src/hooks/api/use-building-history';
import useLandHistory from 'src/hooks/api/use-land-history';
import usePageEstateType from 'src/hooks/use-page-estate-type';

export default function useActiveEstate() {
  const { estateId } = useParams();
  const estateType = usePageEstateType();

  const isLandEstate = estateType === 'land';

  const {
    data: buildingData,
    error: buildingError,
    loading: buildingLoading,
  } = useBuildingHistory(estateId!, { skip: isLandEstate });
  const {
    data: landData,
    error: landError,
    loading: landLoading,
  } = useLandHistory(estateId!, { skip: !isLandEstate });

  if (isLandEstate) {
    return {
      estateType,
      data: landData,
      error: landError,
      loading: landLoading,
    };
  }

  return {
    estateType,
    data: buildingData,
    error: buildingError,
    loading: buildingLoading,
  };
}
