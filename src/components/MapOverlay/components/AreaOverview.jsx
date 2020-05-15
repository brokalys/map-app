import React from 'react';
import { Header } from 'semantic-ui-react';

import styles from './AreaOverview.module.css';

function AreaOverview({ children, year }) {
  return (
    <div>
      <Header as="h4">Selected Area</Header>
      <div>
        <div className={styles.currency}>€</div>
        <div className={styles.amount}>
          { children }
        </div>
        <div className={styles.label}>Median Price {year}</div>
      </div>
    </div>
  );
}

export default AreaOverview;
