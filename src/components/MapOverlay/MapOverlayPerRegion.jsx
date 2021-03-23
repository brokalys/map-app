import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Grid, Header, Message } from 'semantic-ui-react';
import moment from 'moment';

import useMeanPrice from 'hooks/api/use-mean-price';
import useRegionParams from 'hooks/use-region-params';
import AreaOverview from './components/AreaOverview';
import PropertyPriceLine from './components/PropertyPriceLine';
import PropertyTypeChart from './components/PropertyTypeChart';

function PriceLabel({ price }) {
  if (!price) {
    return 'Unknown';
  }

  return parseInt(price, 10).toLocaleString('en');
}

export default function MapOverlayPerRegion() {
  const { locations } = useRegionParams();
  const [startDate] = useState(
    moment().subtract(30, 'days').format('YYYY-MM-DD'),
  );
  const [type] = useState('sell'); // @todo: dynamic
  const { loading, error, data } = useMeanPrice(type, startDate);

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
          {loading ? (
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
