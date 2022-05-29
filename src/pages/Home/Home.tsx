import { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Header, Message, Statistic } from 'semantic-ui-react';

import Bugsnag from 'src/bugsnag';
import getRegionData from 'src/common/get-region-data';
import FilterToolbar from 'src/components/FilterToolbar';
import PropertyPriceChart from 'src/components/PropertyPriceChart';
import MeanPrice from 'src/components/Statistics/MeanPriceInFilterLocation';
import RentalYield from 'src/components/Statistics/RentalYieldInFilterLocation';
import useChartFilters from 'src/hooks/use-price-chart-filters';

import styles from './Home.module.css';

export default function Home() {
  const [{ source, category, neighborhood }] = useChartFilters();
  const { name: locationName } = useMemo(
    () => getRegionData(neighborhood) || { name: '' },
    [neighborhood],
  );

  return (
    <>
      <div className={styles.content}>
        {/* @ts-expect-error */}
        <Header as="h2">
          Average Prices{' '}
          {locationName && (
            <>
              in <span className={styles.highlightedText}>{locationName}</span>
            </>
          )}
        </Header>

        <FilterToolbar />
        <PropertyPriceChart />

        {source === 'classifieds' && (
          <>
            {/* @ts-expect-error */}
            <Header as="h3">Last datapoint</Header>

            <ErrorBoundary
              fallback={
                <Message negative>
                  Failed loading the data. Please try again later.
                </Message>
              }
              onError={(error) => Bugsnag.notify(error)}
            >
              <Statistic.Group size="small" className={styles.statistics}>
                <MeanPrice />
                {category !== 'land' && <RentalYield />}
              </Statistic.Group>
            </ErrorBoundary>
          </>
        )}
      </div>
    </>
  );
}
