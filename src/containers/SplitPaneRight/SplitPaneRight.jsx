import React, { useState } from 'react';

import Map from 'components/Map';
import MapOverlay from 'components/MapOverlay';
import { BuildingContextProvider } from 'context/BuildingContext';
import MapContext from 'context/MapContext';

import styles from './SplitPaneRight.module.css';

function convertBoundsToRegionString(bounds) {
  const parts = [
    [bounds.ne.lat, bounds.ne.lng].join(' '),
    [bounds.nw.lat, bounds.nw.lng].join(' '),
    [bounds.sw.lat, bounds.sw.lng].join(' '),
    [bounds.se.lat, bounds.se.lng].join(' '),
    [bounds.ne.lat, bounds.ne.lng].join(' '),
  ];
  return parts.join(', ');
}

function SplitPaneRight() {
  const [mapState, setMapState] = useState({
    setBounds,
    setZoom,
    bounds: {
      ne: {},
      nw: {},
      se: {},
      sw: {},
    },
    zoom: 14,
    region: '',
  });

  function setBounds(bounds) {
    setMapState((state) => ({
      ...state,
      bounds,
      region: convertBoundsToRegionString(bounds),
    }));
  }

  function setZoom(zoom) {
    setMapState((state) => ({
      ...state,
      zoom,
    }));
  }

  return (
    <div className={styles.container}>
      <MapContext.Provider value={mapState}>
        <BuildingContextProvider>
          <Map />
          <MapOverlay />
        </BuildingContextProvider>
      </MapContext.Provider>
    </div>
  );
}

export default SplitPaneRight;
