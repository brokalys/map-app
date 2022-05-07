import { GoogleMap } from '@react-google-maps/api';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import useSetMapCenter from 'src/hooks/navigation/use-set-map-center';
import useGoogleMaps from 'src/hooks/use-google-maps';
import useMapCenter from 'src/hooks/use-map-center';
import * as actions from 'src/store/actions';

import BuildingPolygons from './components/BuildingPolygons';
import HighlightedPolygon from './components/HighlightedPolygon';

const containerStyle = {
  width: '100%',
  height: '100%',
};

export const MIN_ZOOM_FOR_BUILDINGS = 15;
export const MIN_ZOOM_FOR_HIGHLIGHTED_REGION = 12;
export const MAX_ZOOM_FOR_HIGHLIGHTED_REGION = 14;

function Map(props) {
  const setMapCenter = useSetMapCenter();
  const center = useMapCenter();
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useGoogleMaps();

  const dispatch = useDispatch();
  const onBoundsChanged = useCallback(() => {
    if (!map) return;
    setMapCenter(map);
    dispatch(actions.mapProjectionChanged(map));
  }, [dispatch, setMapCenter, map]);
  const onProjectionChanged = useCallback(
    () => dispatch(actions.mapProjectionChanged(map)),
    [dispatch, map],
  );

  useEffect(() => {
    if (!map) return;
    setMapCenter(map);
    dispatch(actions.mapProjectionChanged(map));
  }, [dispatch, center, setMapCenter, map]);

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
