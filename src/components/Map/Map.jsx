import React, { useContext } from "react";
import GoogleMapReact from "google-map-react";

import MapContext from "context/MapContext";

function Map(props) {
  const context = useContext(MapContext);

  /**
   * Ignore the overlay when doing data lookups by region.
   */
  function onChange(map) {
    const { bounds } = map;

    const mapHeight = map.size.height;
    const overlayHeight = document.getElementById("map-overlay").offsetTop;
    const percentage = 1 - overlayHeight / mapHeight;

    const newBounds = {
      nw: bounds.nw,
      ne: bounds.ne,

      sw: {
        lat:
          bounds.sw.lat +
          (bounds.nw.lat - bounds.sw.lat) * percentage,
        lng: bounds.sw.lng,
      },
      se: {
        lat:
          bounds.se.lat +
          (bounds.nw.lat - bounds.se.lat) * percentage,
        lng: bounds.se.lng,
      },
    };

    context.setBounds(newBounds);
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
