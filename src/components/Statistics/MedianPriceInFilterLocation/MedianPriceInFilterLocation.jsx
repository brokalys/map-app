import React from 'react';
import { useRecoilValue } from 'recoil';
import Skeleton from 'react-loading-skeleton';
import { Statistic } from 'semantic-ui-react';

import { getMedianPriceLastMonth, getPriceTypeFilter } from 'store';
import styles from './MedianPriceInFilterLocation.module.css';

function MedianPriceInFilterLocation() {
  const priceType = useRecoilValue(getPriceTypeFilter);
  const data = useRecoilValue(getMedianPriceLastMonth);

  const median = data.price;
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

        {parseInt(median, 10).toLocaleString('en')}
      </Statistic.Value>
      <Statistic.Label>
        Average Price (EUR
        {priceType === 'sqm' ? (
          <span>
            /m<sup>2</sup>
          </span>
        ) : (
          ''
        )}
        )
      </Statistic.Label>
    </>
  );
}

function MedianPriceInFilterLocationContainer() {
  return (
    <Statistic>
      <React.Suspense fallback={<Skeleton height={60} width={240} />}>
        <MedianPriceInFilterLocation />
      </React.Suspense>
    </Statistic>
  );
}

export default MedianPriceInFilterLocationContainer;
