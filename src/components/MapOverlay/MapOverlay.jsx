import React, { useContext } from 'react';

import MapContext from 'context/MapContext';
import { MIN_ZOOM_FOR_BUILDINGS } from 'context/BuildingContext';
import MapOverlayPerBuilding from './MapOverlayPerBuilding';
import MapOverlayPerRegion from './MapOverlayPerRegion';
import styles from './MapOverlay.module.css';

function MapOverlay() {
  const { zoom } = useContext(MapContext);

  return (
    <div className={styles.container} id="map-overlay">
      {zoom >= MIN_ZOOM_FOR_BUILDINGS ? (
        <MapOverlayPerBuilding />
      ) : (
        <MapOverlayPerRegion />
      )}
    </div>
  );
}

export default MapOverlay;
