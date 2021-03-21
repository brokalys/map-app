import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { gql } from '@apollo/client';
import { Grid, Header, Message } from 'semantic-ui-react';
import moment from 'moment';

import useDebouncedQuery from 'hooks/use-debounced-query';
import useRegionParams from 'hooks/use-region-params';
import AreaOverview from './components/AreaOverview';
import PropertyPriceLine from './components/PropertyPriceLine';
import PropertyTypeChart from './components/PropertyTypeChart';

const GET_MEAN_PRICE = gql`
  query(
    $type: String!
    $date: String!
    $region: [String!]!
    $locations: [String!]
  ) {
    properties(
      filter: {
        type: { eq: $type }
        published_at: { gte: $date }
        location_classificator: { in: $locations }
        region: { in: $region }
      }
    ) {
      summary {
        price(discard: 0.1) {
          mean
        }
      }
    }
  }
`;

function PriceLabel({ price }) {
  if (!price) {
    return 'Unknown';
  }

  return parseInt(price, 10).toLocaleString('en');
}

export default function MapOverlayPerRegion() {
  const { region, locations } = useRegionParams();
  const [startDate] = useState(
    moment().subtract(30, 'days').format('YYYY-MM-DD'),
  );
  const [type] = useState('sell'); // @todo: dynamic
  const { loading, error, data } = useDebouncedQuery(
    GET_MEAN_PRICE,
    {
      variables: {
        type: type,
        date: startDate,
        region,
        locations,
      },
    },
    1000,
  );

  const isLoading = loading || !data;

  if (!locations || !locations.length) {
    return (
      <Message warning>
        <Message.Header>
          Brokalys cannot give an overview for this region
        </Message.Header>
        <p>
          <strong>Why?</strong> you might be outside Riga or you have zoomed out
          too much
        </p>
        <p>
          Interested to see data on a specific building in the countryside or
          Riga? Zoom in and click on it.
        </p>
      </Message>
    );
  }

  if (error) {
    return (
      <Header as="h4">
        An unexpected error occured when attempting to fetch the data. Try again
        later.
      </Header>
    );
  }

  return (
    <Grid>
      <Grid.Column computer={8}>
        <AreaOverview>
          {isLoading ? (
            <Skeleton />
          ) : (
            <PriceLabel price={data.properties.summary.price.mean} />
          )}
        </AreaOverview>

        <PropertyPriceLine type={type} />
      </Grid.Column>
      <Grid.Column computer={8}>
        <PropertyTypeChart type={type} startDate={startDate} />
      </Grid.Column>
    </Grid>
  );
}
