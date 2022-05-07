import { GoogleMap } from '@react-google-maps/api';
import React, { useCallback, useEffect, useState } from 'react';

import useSetMapCenter from 'src/hooks/navigation/use-set-map-center';
import useGoogleMaps from 'src/hooks/use-google-maps';
import useMapCenter from 'src/hooks/use-map-center';
import useMapContext from 'src/hooks/use-map-context';

import BuildingPolygons from './components/BuildingPolygons';
import HighlightedPolygon from './components/HighlightedPolygon';

const containerStyle = {
  width: '100%',
  height: '100%',
};

export const MIN_ZOOM_FOR_BUILDINGS = 15;
export const MIN_ZOOM_FOR_HIGHLIGHTED_REGION = 12;
export const MAX_ZOOM_FOR_HIGHLIGHTED_REGION = 14;

function calculateBounds(map) {
  if (!map.getBounds()) {
    return {};
  }

  return {
    nw: {
      lat: map.getBounds().getSouthWest().lat(),
      lng: map.getBounds().getNorthEast().lng(),
    },
    ne: {
      lat: map.getBounds().getNorthEast().lat(),
      lng: map.getBounds().getNorthEast().lng(),
    },

    sw: {
      lat: map.getBounds().getSouthWest().lat(),
      lng: map.getBounds().getSouthWest().lng(),
    },
    se: {
      lat: map.getBounds().getNorthEast().lat(),
      lng: map.getBounds().getSouthWest().lng(),
    },
  };
}

function Map(props) {
  const [, setMapBounds] = useMapContext();
  const setMapCenter = useSetMapCenter();
  const center = useMapCenter();
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useGoogleMaps();

  const onBoundsChanged = useCallback(() => {
    if (!map) return;
    setMapCenter(map);
    setMapBounds(calculateBounds(map));
  }, [setMapBounds, setMapCenter, map]);
  const onProjectionChanged = useCallback(
    () => setMapBounds(calculateBounds(map)),
    [setMapBounds, map],
  );

  useEffect(onBoundsChanged, [onBoundsChanged]);

  const renderMap = () => {
    const options = {
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_TOP,
      },
      rotateControl: false,
      scaleControl: false,
      streetViewControl: false,
      panControl: false,
      fullscreenControl: false,
    };

    return (
      <GoogleMap
        options={options}
        mapContainerStyle={containerStyle}
        center={center}
        zoom={center.zoom}
        onLoad={setMap}
        onProjectionChanged={onProjectionChanged}
        onDragEnd={onBoundsChanged}
        onZoomChanged={onBoundsChanged}
      >
        {center.zoom <= MAX_ZOOM_FOR_HIGHLIGHTED_REGION &&
          center.zoom >= MIN_ZOOM_FOR_HIGHLIGHTED_REGION && (
            <HighlightedPolygon />
          )}
        {center.zoom >= MIN_ZOOM_FOR_BUILDINGS && <BuildingPolygons />}
      </GoogleMap>
    );
  };

  if (loadError) {
    return <div>Failed loading the map. Please try again later.</div>;
  }

  return isLoaded ? renderMap() : <div>Loading...</div>;
}

export default React.memo(Map);
