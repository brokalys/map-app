import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { Dimmer, Loader, Message, Segment } from 'semantic-ui-react';

import useActiveEstate from 'src/hooks/use-active-estate';

import BuildingTable from './components/BuildingTable';
import Header from './components/Header';
import LandTable from './components/LandTable';

function Body() {
  const { estateType, data: activeEstate, error, loading } = useActiveEstate();

  if (loading) {
    return (
      <Segment basic>
        <Dimmer inverted active>
          <Loader content="Loading the building data.." />
        </Dimmer>
        <Skeleton count={20} />
      </Segment>
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

  if (!activeEstate) {
    return (
      <Message warning>
        <Message.Header>Building not found</Message.Header>
        <p>We could not locate a building here. Try again later.</p>
      </Message>
    );
  }

  if (estateType === 'land') {
    return <LandTable estate={activeEstate as any} />;
  }

  return <BuildingTable building={activeEstate as any} />;
}

export default function BuildingContainer() {
  return (
    <>
      <Header />
      <Body />
    </>
  );
}
