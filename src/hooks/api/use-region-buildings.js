import { gql, useQuery } from '@apollo/client';
import pointInPolygon from 'point-in-polygon';

const GET_BUILDINGS = gql`
  query UseRegionBuildings($region: String!) {
    bounds(bounds: $region) {
      buildings {
        id
        bounds
      }
    }
  }
`;

function isInside(polygonA, polygonB) {
  function convertToCoordinates(str) {
    return str.split(', ').map((part) => part.split(' ').map(parseFloat));
  }

  const coordsA = convertToCoordinates(polygonA);
  const coordsB = convertToCoordinates(polygonB);

  for (let coords of coordsB) {
    if (!pointInPolygon(coords, coordsA)) {
      return false;
    }
  }

  return true;
}

const localCache = {
  cache: [],
  set(region, value) {
    localCache.cache.push({ region, value });
  },
  get(region) {
    return localCache.cache.find((row) => isInside(row.region, region))?.value;
  },
};

export default function useRegionBuildings(region) {
  const cachedData = localCache.get(region);
  const { loading, error, data } = useQuery(GET_BUILDINGS, {
    variables: {
      region,
    },
    context: {
      debounceKey: 'GET_BUILDINGS',
    },
    skip: !!cachedData,
  });

  if (cachedData) {
    return { loading: false, data: cachedData };
  }

  if (data) {
    localCache.set(region, data?.bounds?.buildings || []);
  }

  return {
    loading,
    data: error ? [] : data?.bounds?.buildings,
  };
}
