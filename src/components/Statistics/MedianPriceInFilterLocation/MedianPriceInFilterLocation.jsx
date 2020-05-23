import React from "react";
import { useRecoilValue } from "recoil";
import Skeleton from "react-loading-skeleton";
import { Statistic } from "semantic-ui-react";

import { getMedianPriceLastMonth } from "store";
import styles from "./MedianPriceInFilterLocation.module.css";

function MedianPriceInFilterLocation() {
  const data = useRecoilValue(getMedianPriceLastMonth);

  const median = data.price;
  const momChange = data.change.mom;
  const yoyChange = data.change.yoy;

  return (
    <div>
      <div className={styles.statisticAddon}>
        {isFinite(momChange) && (
          <div>
            <span className={momChange < 0 ? styles.textGreen : styles.textRed}>
              {momChange < 0 ? "+" : ""}
              {-momChange.toFixed(2)}%
            </span>{" "}
            MoM
          </div>
        )}
        {isFinite(yoyChange) && (
          <div>
            <span className={yoyChange < 0 ? styles.textGreen : styles.textRed}>
              {yoyChange < 0 ? "+" : ""}
              {-yoyChange.toFixed(2)}%
            </span>{" "}
            YoY
          </div>
        )}
      </div>

      {parseInt(median, 10).toLocaleString("en")}
    </div>
  );
}

function MedianPriceInFilterLocationContainer() {
  return (
    <Statistic>
      <Statistic.Value>
        <React.Suspense fallback={<Skeleton height={42} />}>
          <MedianPriceInFilterLocation />
        </React.Suspense>
      </Statistic.Value>
      <Statistic.Label>
        Median Price (EUR/m<sup>2</sup>)
      </Statistic.Label>
    </Statistic>
  );
}

export default MedianPriceInFilterLocationContainer;
