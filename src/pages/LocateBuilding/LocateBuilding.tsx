import * as geolib from 'geolib';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Message } from 'semantic-ui-react';

import useGoToEstate from 'src/hooks/navigation/use-go-to-estate';
import useActiveRegionEstates from 'src/hooks/use-active-region-estates';
import useMapCenter from 'src/hooks/use-map-center';
import type { Building } from 'src/types/building';

import styles from './LocateBuilding.module.css';
import loadingAnimationData from './animations/loading.json';
import notFoundAnimationData from './animations/not-found.json';
import successAnimationData from './animations/success.json';
import Container from './components/Container';

function buildPolygon(bounds: string) {
  return bounds.split(/,\s?/).map((row) => {
    const parts = row.split(' ');
    return { latitude: parts[0], longitude: parts[1] };
  });
}

/**
 * Locate the closest building.
 */
function locateActiveBuilding(
  buildings: Building[],
  currentPosition: { latitude: number; longitude: number },
) {
  let locatedBuilding: Building | undefined;
  let minDistance = Infinity;
  const maxDistance = 500;

  // Find the building closest to current position
  buildings.forEach((building) => {
    const coords = geolib.getCenter(buildPolygon(building.bounds));

    if (!coords) {
      return;
    }

    const distance = geolib.getDistance(currentPosition, coords);

    if (distance < minDistance && distance < maxDistance) {
      minDistance = distance;
      locatedBuilding = building;
    }
  });

  return locatedBuilding;
}

export default function LocateBuilding() {
  const { data: buildings, loading, error } = useActiveRegionEstates();

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

  return <BuildingsLoaded buildings={buildings as any} />;
}

interface BuildingsLoadedProps {
  buildings: Building[];
}

const BuildingsLoaded: React.FC<BuildingsLoadedProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lat, lng } = useMapCenter();
  const goToProperty = useGoToEstate('building');
  const locatedBuilding = locateActiveBuilding(props.buildings || [], {
    latitude: lat,
    longitude: lng,
  });
  const onReturnHomeButtonClick = () => {
    const [, coords] = location.pathname.split('/');
    navigate(`/${coords}${location.search}`);
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

  const onButtonClick = () => {
    goToProperty(locatedBuilding.id);
  };

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
};
