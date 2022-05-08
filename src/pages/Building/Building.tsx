import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { Dimmer, Loader, Message, Segment } from 'semantic-ui-react';

import useActiveBuilding from 'src/hooks/api/use-active-building';

import BuildingTable from './components/BuildingTable';
import Header from './components/Header';

function Body() {
  const { data: activeBuilding, error, loading } = useActiveBuilding();

  if (loading) {
    return (
      <>
        {/* @ts-expect-error */}
        <Segment basic>
          <Dimmer inverted active>
            <Loader content="Loading the building data.." />
          </Dimmer>
          <Skeleton count={20} />
        </Segment>
      </>
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

  if (!activeBuilding) {
    return (
      <Message warning>
        <Message.Header>Building not found</Message.Header>
        <p>We could not locate a building here. Try again later.</p>
      </Message>
    );
  }

  return <BuildingTable building={activeBuilding} />;
}

export default function BuildingContainer() {
  return (
    <>
      <Header />
      <Body />
    </>
  );
}
