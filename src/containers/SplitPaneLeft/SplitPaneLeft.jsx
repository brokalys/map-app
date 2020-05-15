import React from 'react';
import { Header } from 'semantic-ui-react';

import FilterToolbar from 'components/FilterToolbar';
import Navigation from 'components/Navigation';
import PropertyPriceChart from 'components/PropertyPriceChart';
import LastThirtyDayOverview from 'containers/LastThirtyDayOverview';

import styles from './SplitPaneLeft.module.css';

const selectedLocation = { text: 'Āgenskalns' };

function SplitPaneLeft() {
  return (
    <div className={styles.container}>
      <Navigation />

      <div className={styles.content}>
        <Header as="h2">Average Prices in <span className={styles.highlightedText}>{selectedLocation.text}</span></Header>

        <FilterToolbar />
        <PropertyPriceChart />
        <LastThirtyDayOverview />
      </div>
    </div>
  );
}

export default SplitPaneLeft;
