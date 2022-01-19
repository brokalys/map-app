import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { Icon, Popup, Statistic } from 'semantic-ui-react';

import usePriceData from 'src/hooks/api/use-property-price-mean-data';
import { neighborhoodFilterSelector } from 'src/store/selectors';

import styles from './MeanPriceInFilterLocation.module.css';

function Description() {
  return (
    <>
      <p>MoM: month-over-month</p>
      <p>YoY: year-over-year</p>
    </>
  );
}

function MeanPriceInFilterLocation() {
  const { price: priceType } = useSelector(neighborhoodFilterSelector);
  const data = usePriceData();

  const mean = data.price;
  const momChange = data.change.mom;
  const yoyChange = data.change.yoy;

  return (
    <>
      <Statistic.Value>
        <div className={styles.statisticAddon}>
          {isFinite(momChange) && (
            <div>
              <span
                className={momChange < 0 ? styles.textGreen : styles.textRed}
              >
                {momChange < 0 ? '+' : ''}
                {-momChange.toFixed(2)}%
              </span>{' '}
              MoM
            </div>
          )}
          {isFinite(yoyChange) && (
            <div>
              <span
                className={yoyChange < 0 ? styles.textGreen : styles.textRed}
              >
                {yoyChange < 0 ? '+' : ''}
                {-yoyChange.toFixed(2)}%
              </span>{' '}
              YoY
            </div>
          )}
        </div>

        {mean ? parseInt(mean, 10).toLocaleString('en') : '?'}
      </Statistic.Value>
      <Statistic.Label>
        Average Price (€
        {priceType === 'sqm' ? (
          <span>
            /m<sup>2</sup>
          </span>
        ) : (
          ''
        )}
        ){' '}
        <Popup
          content={<Description />}
          trigger={<Icon name="help circle" />}
        />
      </Statistic.Label>
    </>
  );
}

function MeanPriceInFilterLocationContainer() {
  return (
    <Statistic>
      <React.Suspense fallback={<Skeleton height={60} width={240} />}>
        <MeanPriceInFilterLocation />
      </React.Suspense>
    </Statistic>
  );
}

export default MeanPriceInFilterLocationContainer;
