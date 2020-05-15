import React, { useContext } from 'react';
import GoogleMapReact from 'google-map-react';

import MapContext from 'context/MapContext';

function Map() {
  const context = useContext(MapContext);

  function onChange({ bounds }) {
    context.setBounds(bounds);
  }

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
      defaultCenter={{
        lat: 56.879635,
        lng: 24.603189,
      }}
      defaultZoom={7}
      options={{
        disableDefaultUI: true,
      }}
      onChange={onChange}
    />
  );
}

export default Map;
