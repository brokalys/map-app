import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import useMapCenter from 'hooks/use-map-center';
import * as actions from 'store/actions';
import BuildingPolygons from './components/BuildingPolygons';
import HighlightedPolygon from './components/HighlightedPolygon';

const containerStyle = {
  width: '100%',
  height: '100%',
};

export const MIN_ZOOM_FOR_BUILDINGS = 17;
export const MIN_ZOOM_FOR_HIGHLIGHTED_REGION = 12;
export const MAX_ZOOM_FOR_HIGHLIGHTED_REGION = 14;

function Map(props) {
  const center = useMapCenter();
  const [initialCenter] = useState(center);
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  });

  const dispatch = useDispatch();
  const onBoundsChanged = useCallback(() => {
    if (!map) return;
    dispatch(actions.mapBoundsChanged(map));
  }, [dispatch, map]);
  const onProjectionChanged = useCallback(
    () => dispatch(actions.mapProjectionChanged(map)),
    [dispatch, map],
  );

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
        center={initialCenter}
        zoom={initialCenter.zoom}
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
