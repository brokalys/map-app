import React from 'react';
import { useRecoilState } from 'jared-recoil';
import { ErrorBoundary } from 'react-error-boundary';
import { Header, Message, Statistic } from 'semantic-ui-react';

import Bugsnag from 'bugsnag';
import FilterToolbar from 'components/FilterToolbar';
import Navigation from 'components/Navigation';
import PropertyPriceChart from 'components/PropertyPriceChart';
import MedianPrice from 'components/Statistics/MedianPriceInFilterLocation';
import RentalYield from 'components/Statistics/RentalYieldInFilterLocation';
import { filterState } from 'store';

import styles from './SplitPaneLeft.module.css';

function SplitPaneLeft() {
  const [filters] = useRecoilState(filterState);

  return (
    <div className={styles.container}>
      <Navigation />

      <div className={styles.content}>
        <Header as="h2">
          Median Prices in{' '}
          <span className={styles.highlightedText}>{filters.location}</span>
        </Header>

        <FilterToolbar />
        <PropertyPriceChart />

        <div>
          <Header as="h3">Last Month</Header>

          <ErrorBoundary
            fallback={
              <Message negative>
                Failed loading the data. Please try again later.
              </Message>
            }
            onError={Bugsnag.notify}
          >
            <Statistic.Group size="small">
              <MedianPrice />
              <RentalYield />
            </Statistic.Group>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default SplitPaneLeft;
