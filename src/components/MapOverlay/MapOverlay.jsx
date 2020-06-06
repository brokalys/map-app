import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { gql } from '@apollo/client';
import { Grid, Header } from 'semantic-ui-react';
import moment from 'moment';

import useDebouncedQuery from 'hooks/use-debounced-query';
import useRegionParams from 'hooks/use-region-params';
import AreaOverview from './components/AreaOverview';
import PropertyPriceLine from './components/PropertyPriceLine';
import PropertyTypeChart from './components/PropertyTypeChart';

import styles from './MapOverlay.module.css';

const GET_MEDIAN_PRICE = gql`
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
        price {
          median
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

function MapOverlay() {
  const { region, locations } = useRegionParams();
  const [startDate] = useState(
    moment().subtract(30, 'days').format('YYYY-MM-DD'),
  );
  const [type] = useState('sell'); // @todo: dynamic
  const { loading, error, data } = useDebouncedQuery(
    GET_MEDIAN_PRICE,
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

  if (error) {
    return (
      <div className={styles.container}>
        <Header as="h4">
          An unexpected error occured when attempting to fetch the data. Try
          again later.
        </Header>
      </div>
    );
  }

  return (
    <div className={styles.container} id="map-overlay">
      <Grid>
        <Grid.Column computer={8}>
          <AreaOverview>
            {isLoading ? (
              <Skeleton />
            ) : (
              <PriceLabel price={data.properties.summary.price.median} />
            )}
          </AreaOverview>

          <PropertyPriceLine type={type} />
        </Grid.Column>
        <Grid.Column computer={8}>
          <PropertyTypeChart type={type} startDate={startDate} />
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default MapOverlay;
