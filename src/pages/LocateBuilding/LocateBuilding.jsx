import * as geolib from 'geolib';
import { useDispatch } from 'react-redux';
import { Button, Message } from 'semantic-ui-react';
import useActiveRegionBuildings from 'hooks/use-active-region-buildings';
import useMapCenter from 'hooks/use-map-center';
import * as actions from 'store/actions';
import loadingAnimationData from './animations/loading.json';
import notFoundAnimationData from './animations/not-found.json';
import successAnimationData from './animations/success.json';
import Container from './components/Container';
import styles from './LocateBuilding.module.css';

function buildPolygon(bounds) {
  return bounds.split(/,\s?/).map((row) => {
    const parts = row.split(' ');
    return { latitude: parts[0], longitude: parts[1] };
  });
}

function locateActiveBuilding(buildings, currentPosition) {
  return buildings.find(({ bounds }) =>
    geolib.isPointInPolygon(currentPosition, buildPolygon(bounds)),
  );
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

function BuildingsLoaded({ buildings }) {
  const dispatch = useDispatch();
  const { lat, lng } = useMapCenter();
  const locatedBuilding = locateActiveBuilding(buildings || [], {
    latitude: lat,
    longitude: lng,
  });
  const onButtonClick = () => {
    dispatch(actions.clickOnBuilding(locatedBuilding.id));
  };
  const onReturnHomeButtonClick = () => {
    dispatch(actions.returnToHomeClicked());
  };

  if (!locatedBuilding || locatedBuilding.properties.results.length === 0) {
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
