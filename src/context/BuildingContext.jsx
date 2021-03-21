import React, { useState } from 'react';

const BuildingContext = React.createContext();

export const MIN_ZOOM_FOR_BUILDINGS = 17;

export function BuildingContextProvider(props) {
  const [state, setState] = useState({
    setActiveBuilding,
    activeBuilding: undefined,

    buildingCount: 0,
    setBuildingCount,

    loading: false,
    error: undefined,
    setLoading,
    setError,
  });

  function setActiveBuilding(building) {
    setState((current) => {
      if (current.activeBuilding === building) {
        return current;
      }

      return {
        ...current,
        activeBuilding: building,
      };
    });
  }

  function setBuildingCount(buildingCount) {
    setStateSlice('buildingCount', buildingCount);
  }

  function setLoading(loading) {
    setStateSlice('loading', loading);
  }

  function setError(error) {
    setStateSlice('error', error);
  }

  function setStateSlice(sliceName, sliceValue) {
    setState((current) => ({
      ...current,
      [sliceName]: sliceValue,
    }));
  }

  return (
    <BuildingContext.Provider value={state}>
      {props.children}
    </BuildingContext.Provider>
  );
}

export default BuildingContext;
