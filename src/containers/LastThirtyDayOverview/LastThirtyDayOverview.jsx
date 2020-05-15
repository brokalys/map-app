import React from 'react';
import { Header, Statistic } from 'semantic-ui-react';

import styles from './LastThirtyDayOverview.module.css';

function LastThirtyDayOverview() {
  return (
    <div>
      <Header as="h3">Last 30 days</Header>

      <Statistic.Group size="small">
        <Statistic>
          <Statistic.Value>
            <div className={styles.statisticAddon}>
              <div><span className={styles.textGreen}>+15.00%</span> MoM</div>
              <div><span className={styles.textRed}>-3.10%</span> YoY</div>
            </div>

            1,500
          </Statistic.Value>
          <Statistic.Label>Median Price (EUR/m<sup>2</sup>)</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            <div className={styles.statisticAddon}>
              <div><span className={styles.textGreen}>+9.54%</span> MoM</div>
              <div><span className={styles.textRed}>-1.10%</span> YoY</div>
            </div>

            <span>240</span>
          </Statistic.Value>
          <Statistic.Label>Classified amount</Statistic.Label>
        </Statistic>

        <Statistic color="green" value={1.5} label="Buy-to-ley ratio" />
      </Statistic.Group>
    </div>
  );
}

export default LastThirtyDayOverview;
