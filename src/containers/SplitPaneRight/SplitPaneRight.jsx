import React, { useState } from "react";

import Map from "components/Map";
import MapOverlay from "components/MapOverlay";
import MapContext from "context/MapContext";

import styles from "./SplitPaneRight.module.css";

function convertBoundsToRegionString(bounds) {
  const parts = [
    [bounds.ne.lat, bounds.ne.lng].join(" "),
    [bounds.nw.lat, bounds.nw.lng].join(" "),
    [bounds.se.lat, bounds.se.lng].join(" "),
    [bounds.sw.lat, bounds.sw.lng].join(" "),
    [bounds.ne.lat, bounds.ne.lng].join(" "),
  ];
  return parts.join(", ");
}

function SplitPaneRight() {
  const [mapState, setMapState] = useState({
    setBounds,
    bounds: {
      ne: {},
      nw: {},
      se: {},
      sw: {},
    },
    region: "",
  });

  function setBounds(bounds) {
    setMapState((state) => ({
      ...state,
      bounds,
      region: convertBoundsToRegionString(bounds),
    }));
  }

  return (
    <div className={styles.container}>
      <MapContext.Provider value={mapState}>
        <Map />
        <MapOverlay />
      </MapContext.Provider>
    </div>
  );
}

export default SplitPaneRight;
