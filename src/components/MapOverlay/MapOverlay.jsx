import React, { useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useQuery, gql } from '@apollo/client';
import { Grid, Header } from 'semantic-ui-react';

import MapContext from 'context/MapContext';
import AreaOverview from './components/AreaOverview';
import PropertyPriceLine from './components/PropertyPriceLine';
import PropertyTypeChart from './components/PropertyTypeChart';

import styles from './MapOverlay.module.css';

const chartData = require('data/region-bar-chart.json');
const lineData = require('data/region-line-chart.json');

const GET_MEDIAN_PRICE = gql`
  query (
    $type: Type
    $date: Date!
    $region: String!
  ) {
    getMedianPrice(
      type: $type
      start_date: $date
      region: $region
    ) {
      price
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
  const map = useContext(MapContext);
  const { loading, error, data } = useQuery(GET_MEDIAN_PRICE, {
    variables: {
      type: 'SELL',
      date: '2019-01-01',
      region: map.region,
    },
    skip: !map.region,
  });

  const isLoading = loading || !data;

  if (error) {
    return (
      <div className={styles.container}>
        <Header as="h4">An unexpected error occured when attempting to fetch the data. Try again later.</Header>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Grid>
        <Grid.Column computer={8}>
          <AreaOverview year={2019}>
            { isLoading ? <Skeleton /> : <PriceLabel price={data.getMedianPrice.price} />}
          </AreaOverview>

          <PropertyPriceLine data={lineData} />
        </Grid.Column>
        <Grid.Column computer={8}>
          { isLoading ? <Skeleton height={206} /> : <PropertyTypeChart data={chartData} /> }
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default MapOverlay;
