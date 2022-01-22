import { Polygon } from '@react-google-maps/api';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

import useActiveRegionBuildings from 'src/hooks/use-active-region-buildings';
import * as actions from 'src/store/actions';

import styles from './BuildingPolygons.module.css';

function BuildingPolygons() {
  const dispatch = useDispatch();
  const location = useLocation();
  const disableInteraction = location.pathname.endsWith('/locate-building');
  const { buildingId } = useParams();
  const { loading, data: buildings } = useActiveRegionBuildings();

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

  return buildings.map((building) => (
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

export default React.memo(BuildingPolygons);
