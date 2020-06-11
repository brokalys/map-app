import React, { useContext } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

import MapContext from 'context/MapContext';

const center = {
  lat: 56.9032640496857,
  lng: 24.09330663700942,
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

function Map(props) {
  const [map, setMap] = React.useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  });

  const context = useContext(MapContext);

  /**
   * Ignore the overlay when doing data lookups by region.
   */
  function onBoundsChanged() {
    const mapHeight = map.getDiv().clientHeight;
    const overlayHeight = document.getElementById('map-overlay').offsetTop;
    const percentage = 1 - overlayHeight / mapHeight;

    const newBounds = {
      nw: {
        lat:
          map.getBounds().getSouthWest().lat() +
          (map.getBounds().getNorthEast().lat() -
            map.getBounds().getSouthWest().lat()) *
            percentage,
        lng: map.getBounds().getNorthEast().lng(),
      },
      ne: {
        lat: map.getBounds().getNorthEast().lat(),
        lng: map.getBounds().getNorthEast().lng(),
      },

      sw: {
        lat:
          map.getBounds().getSouthWest().lat() +
          (map.getBounds().getNorthEast().lat() -
            map.getBounds().getSouthWest().lat()) *
            percentage,
        lng: map.getBounds().getSouthWest().lng(),
      },
      se: {
        lat: map.getBounds().getNorthEast().lat(),
        lng: map.getBounds().getSouthWest().lng(),
      },
    };

    context.setBounds(newBounds);
  }

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
        zoom={11}
        onLoad={setMap}
        onBoundsChanged={onBoundsChanged}
      />
    );
  };

  if (loadError) {
    return <div>Failed loading the map. Please try again later.</div>;
  }

  return isLoaded ? renderMap() : <div>Loading...</div>;
}

export default React.memo(Map);
