import { ErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import { Header, Message, Statistic } from 'semantic-ui-react';

import Bugsnag from 'src/bugsnag';
import FilterToolbar from 'src/components/FilterToolbar';
import PropertyPriceChart from 'src/components/PropertyPriceChart';
import MeanPrice from 'src/components/Statistics/MeanPriceInFilterLocation';
import RentalYield from 'src/components/Statistics/RentalYieldInFilterLocation';
import {
  neighborhoodFilterSelector,
  selectedNeighborhoodSelector,
} from 'src/store/selectors';

import styles from './Home.module.css';

export default function Home() {
  const {
    properties: { name: locationName },
  } = useSelector(selectedNeighborhoodSelector);
  const { source } = useSelector(neighborhoodFilterSelector);

  return (
    <>
      <div className={styles.content}>
        <Header as="h2">
          Average Prices in{' '}
          <span className={styles.highlightedText}>{locationName}</span>
        </Header>

        <FilterToolbar />
        <PropertyPriceChart />

        <Header as="h3">Last datapoint</Header>

        <ErrorBoundary
          fallback={
            <Message negative>
              Failed loading the data. Please try again later.
            </Message>
          }
          onError={Bugsnag.notify}
        >
          <Statistic.Group size="small">
            <MeanPrice />
            {source === 'classifieds' && <RentalYield />}
          </Statistic.Group>
        </ErrorBoundary>
      </div>
    </>
  );
}
