import * as geolib from 'geolib';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Message } from 'semantic-ui-react';

import useGoToBuilding from 'src/hooks/navigation/use-go-to-building';
import useActiveRegionBuildings from 'src/hooks/use-active-region-buildings';
import useMapCenter from 'src/hooks/use-map-center';

import styles from './LocateBuilding.module.css';
import loadingAnimationData from './animations/loading.json';
import notFoundAnimationData from './animations/not-found.json';
import successAnimationData from './animations/success.json';
import Container from './components/Container';

function buildPolygon(bounds) {
  return bounds.split(/,\s?/).map((row) => {
    const parts = row.split(' ');
    return { latitude: parts[0], longitude: parts[1] };
  });
}

/**
 * Locate the closest building.
 */
function locateActiveBuilding(buildings, currentPosition) {
  let locatedBuilding;
  let minDistance = Infinity;
  const maxDistance = 500;

  // Find the building closest to current position
  buildings.forEach((building) => {
    const distance = geolib.getDistance(
      currentPosition,
      geolib.getCenter(buildPolygon(building.bounds)),
    );

    if (distance < minDistance && distance < maxDistance) {
      minDistance = distance;
      locatedBuilding = building;
    }
  });

  return locatedBuilding;
}

export default function LocateBuilding() {
  const { data: buildings, loading, error } = useActiveRegionBuildings();

  if (loading) {
    return (
      <Container
        lottie={{
          className: styles.loadingAnimation,
          animationData: loadingAnimationData,
        }}
      >
        <p>
          <strong>Loading</strong> the historical data for this property... Hang
          tight!
        </p>
      </Container>
    );
  }

  if (error) {
    return (
      <Message negative>
        An unexpected error occured when attempting to fetch the data. Try again
        later.
      </Message>
    );
  }

  return <BuildingsLoaded buildings={buildings} />;
}

function BuildingsLoaded(props) {
  const history = useHistory();
  const location = useLocation();
  const { lat, lng } = useMapCenter();
  const goToBuilding = useGoToBuilding();
  const locatedBuilding = locateActiveBuilding(props.buildings || [], {
    latitude: lat,
    longitude: lng,
  });
  const onButtonClick = () => {
    goToBuilding(locatedBuilding.id);
  };
  const onReturnHomeButtonClick = () => {
    const [, coords] = location.pathname.split('/');
    history.push(`/${coords}${location.search}`);
  };

  if (!locatedBuilding) {
    return (
      <Container
        lottie={{
          className: styles.notFoundAnimation,
          animationData: notFoundAnimationData,
          loop: false,
        }}
      >
        <p>Could not match the classified with a specific building.</p>
        <Button primary onClick={onReturnHomeButtonClick}>
          Return home
        </Button>
      </Container>
    );
  }

  return (
    <Container
      lottie={{
        className: styles.successAnimation,
        animationData: successAnimationData,
        loop: false,
      }}
    >
      <p>
        A building has been found! Click below to see the historical prices for
        this building.
      </p>
      <Button primary onClick={onButtonClick}>
        Open
      </Button>
    </Container>
  );
}
