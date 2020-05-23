import React from "react";
import Skeleton from "react-loading-skeleton";
import { Header, Statistic } from "semantic-ui-react";

import MedianPrice from "components/Statistics/MedianPriceInFilterLocation";
import RentalYield from "components/Statistics/RentalYieldInFilterLocation";
import styles from "./LastMonthOverview.module.css";

function PropertyCount({ loading, data }) {
  if (loading) {
    return <Skeleton height={42} />;
  }

  const { count } = data.current_month.summary;
  const momChange = (1 - count / data.last_month.summary.count) * 100;
  const yoyChange = (1 - count / data.last_year.summary.count) * 100;

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

      {count}
    </div>
  );
}

function LastMonthOverview() {
  return (
    <div>
      <Header as="h3">Last Month</Header>

      <Statistic.Group size="small">
        <MedianPrice />

        {/*<Statistic>
          <Statistic.Value>
            <PropertyCount loading={loading} data={data} />
          </Statistic.Value>
          <Statistic.Label>Classified amount</Statistic.Label>
        </Statistic>*/}

        <RentalYield />
      </Statistic.Group>
    </div>
  );
}

export default LastMonthOverview;
