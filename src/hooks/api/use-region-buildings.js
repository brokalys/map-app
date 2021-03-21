import { gql } from '@apollo/client';
import { useContext, useEffect } from 'react';

import BuildingContext from 'context/BuildingContext';
import MapContext from 'context/MapContext';
import useDebouncedQuery from 'hooks/use-debounced-query';

const GET_BUILDINGS_AND_PROPERTIES = gql`
  query($region: String!) {
    buildings(bounds: $region) {
      id
      bounds
      properties {
        results {
          category
          type
          rent_type
          price
          price_per_sqm
          rooms
          area
          floor
          published_at
        }
      }
    }
  }
`;

export default function useRegionBuildings() {
  const { region } = useContext(MapContext);
  const { setBuildingCount, setError, setLoading } = useContext(
    BuildingContext,
  );

  const { loading, error, data } = useDebouncedQuery(
    GET_BUILDINGS_AND_PROPERTIES,
    {
      variables: { region },
    },
    1000,
  );

  const buildings = data ? data.buildings : [];

  useEffect(() => {
    setLoading(loading);
  }, [setLoading, loading]);

  useEffect(() => {
    setError(error);
  }, [setError, error]);

  useEffect(() => {
    setBuildingCount(buildings.length);
  }, [setBuildingCount, buildings.length]);

  return {
    loading,
    error,
    data: buildings,
  };
}
