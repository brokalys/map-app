import React, { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { Header, Statistic } from "semantic-ui-react";
import { gql } from "@apollo/client";
import moment from "moment";

import FilterContext from "context/FilterContext";
import useDebouncedQuery from "hooks/use-debounced-query";
import styles from "./LastThirtyDayOverview.module.css";

const GET_MEDIAN_PRICE = gql`
  query(
    $type: String!
    $category: String!
    $last_30_days_start: String!
    $last_month_start: String!
    $last_month_end: String!
    $last_year_start: String!
    $last_year_end: String!
    $region: [String!]!
  ) {
    last_30_days: properties(
      filter: {
        category: { eq: $category }
        type: { eq: $type }
        published_at: { gte: $last_30_days_start }
        region: { in: $region }
      }
    ) {
      summary {
        count
        price {
          median
        }
      }
    }

    last_month: properties(
      filter: {
        category: { eq: $category }
        type: { eq: $type }
        published_at: { gte: $last_month_start, lt: $last_month_end }
        region: { in: $region }
      }
    ) {
      summary {
        count
        price {
          median
        }
      }
    }

    last_year: properties(
      filter: {
        category: { eq: $category }
        type: { eq: $type }
        published_at: { gte: $last_year_start, lt: $last_year_end }
        region: { in: $region }
      }
    ) {
      summary {
        count
        price {
          median
        }
      }
    }
  }
`;

const today = moment().utc().startOf("day");
const lastThirtyDays = today.clone().subtract(30, "days");

function MedianPrice({ loading, data }) {
  if (loading) {
    return <Skeleton height={42} />;
  }

  const { median } = data.last_30_days.summary.price;
  const momChange = (1 - median / data.last_month.summary.price.median) * 100;
  const yoyChange = (1 - median / data.last_year.summary.price.median) * 100;

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

function PropertyCount({ loading, data }) {
  if (loading) {
    return <Skeleton height={42} />;
  }

  const { count } = data.last_30_days.summary;
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

function LastThirtyDayOverview() {
  const context = useContext(FilterContext);

  const { loading, data } = useDebouncedQuery(
    GET_MEDIAN_PRICE,
    {
      variables: {
        type: context.type.selected,
        category: context.category.selected,
        last_30_days_start: lastThirtyDays.toISOString(),
        last_month_start: lastThirtyDays
          .clone()
          .subtract(1, "month")
          .toISOString(),
        last_month_end: today.clone().subtract(1, "month").toISOString(),
        last_year_start: lastThirtyDays
          .clone()
          .subtract(1, "year")
          .toISOString(),
        last_year_end: today.clone().subtract(1, "year").toISOString(),
        region: [context.location.selectedRegion],
      },
    },
    1000
  );

  return (
    <div>
      <Header as="h3">Last 30 days</Header>

      <Statistic.Group size="small">
        <Statistic>
          <Statistic.Value>
            <MedianPrice loading={loading} data={data} />
          </Statistic.Value>
          <Statistic.Label>
            Median Price (EUR/m<sup>2</sup>)
          </Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            <PropertyCount loading={loading} data={data} />
          </Statistic.Value>
          <Statistic.Label>Classified amount</Statistic.Label>
        </Statistic>

        <Statistic color="green" value={1.5} label="Buy-to-ley ratio" />
      </Statistic.Group>
    </div>
  );
}

export default LastThirtyDayOverview;
