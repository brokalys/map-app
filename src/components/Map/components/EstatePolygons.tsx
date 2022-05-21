import { Polygon } from '@react-google-maps/api';
import { useLocation, useParams } from 'react-router-dom';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

import useGoToEstate from 'src/hooks/navigation/use-go-to-estate';
import useActiveRegionEstates from 'src/hooks/use-active-region-estates';
import type { Estate } from 'src/types/estate';

import styles from './BuildingPolygons.module.css';

function EstatePolygons() {
  const location = useLocation();
  const disableInteraction = location.pathname.endsWith('/locate-building');
  const { estateId } = useParams();
  const { type, loading, data: estates } = useActiveRegionEstates();
  const goToEstate = useGoToEstate(type);

  const onPolygonClick = (estate: Estate) => {
    goToEstate(estate.id);
  };

  if (disableInteraction) {
    return <Dimmer active />;
  }

  if (loading) {
    return (
      <>
        {/* @ts-expect-error */}
        <Segment circular className={styles.loadingIndicator}>
          <Dimmer active>
            <Loader />
          </Dimmer>
        </Segment>
      </>
    );
  }

  return (
    <>
      {estates.map((estate) => (
        <Polygon
          key={estate.id}
          onClick={() => onPolygonClick(estate)}
          paths={estate.bounds.split(', ').map((row: string) => {
            const [lat, lng] = row.split(' ');
            return { lat: parseFloat(lat), lng: parseFloat(lng) };
          })}
          options={
            estateId && estateId === estate.id.toString()
              ? { strokeColor: 'green', fillColor: 'green' }
              : { strokeColor: 'black', fillColor: 'black' }
          }
        />
      ))}
    </>
  );
}

export default EstatePolygons;
