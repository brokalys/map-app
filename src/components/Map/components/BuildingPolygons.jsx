import { Polygon } from '@react-google-maps/api';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

import useRegionBuildings from 'src/hooks/api/use-region-buildings';
import * as actions from 'src/store/actions';
import { mapRegionSelector } from 'src/store/selectors';

import styles from './BuildingPolygons.module.css';

function Polygons(props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const disableInteraction = location.pathname.endsWith('/locate-building');
  const { buildingId } = useParams();
  const { loading, data: buildings } = useRegionBuildings(props.region);

  const onBuildingClick = (building) => {
    dispatch(actions.clickOnBuilding(building.id));
  };

  if (disableInteraction) {
    return <Dimmer active />;
  }

  if (loading) {
    return (
      <Segment circular className={styles.loadingIndicator}>
        <Dimmer active>
          <Loader />
        </Dimmer>
      </Segment>
    );
  }

  return buildings
    .filter(({ properties }) => properties.results.length > 0)
    .map((building) => (
      <Polygon
        key={building.id}
        onClick={() => onBuildingClick(building)}
        paths={building.bounds.split(', ').map((row) => {
          const [lat, lng] = row.split(' ');
          return { lat: parseFloat(lat), lng: parseFloat(lng) };
        })}
        options={
          buildingId && buildingId === building.id.toString()
            ? { strokeColor: 'green', fillColor: 'green' }
            : { strokeColor: 'black', fillColor: 'black' }
        }
      />
    ));
}

function BuildingPolygons() {
  const region = useSelector(mapRegionSelector);

  if (!region) {
    return null;
  }

  // @todo: error handling
  return <Polygons region={region} />;
}

export default React.memo(BuildingPolygons);
