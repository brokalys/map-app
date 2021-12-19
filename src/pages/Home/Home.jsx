import Bugsnag from 'bugsnag';
import { ErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import { Grid, Header, Message, Statistic } from 'semantic-ui-react';
import FilterToolbar from 'components/FilterToolbar';
import PropertyPriceChart from 'components/PropertyPriceChart';
import MeanPrice from 'components/Statistics/MeanPriceInFilterLocation';
import RentalYield from 'components/Statistics/RentalYieldInFilterLocation';
import { selectedNeighborhoodSelector } from 'store/selectors';
import styles from './Home.module.css';

export default function Home() {
  const {
    properties: { name: locationName },
  } = useSelector(selectedNeighborhoodSelector);

  return (
    <>
      <div className={styles.content}>
        <Header as="h2">
          Average Prices in{' '}
          <span className={styles.highlightedText}>{locationName}</span>
        </Header>

        <FilterToolbar />
        <PropertyPriceChart />

        <Grid>
          <Grid.Row>
            <Grid.Column
              tablet={16}
              computer={16}
              largeScreen={10}
              widescreen={7}
            >
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
                  <MeanPrice />
                  <RentalYield />
                </Statistic.Group>
              </ErrorBoundary>
            </Grid.Column>

            <Grid.Column
              tablet={16}
              computer={16}
              largeScreen={6}
              widescreen={9}
              verticalAlign="bottom"
              stretched
            >
              <Message
                info
                icon="info"
                header="Interested in a specific building?"
                content="Zoom in on the map and click on a building. This will show data about your selected property."
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </>
  );
}
