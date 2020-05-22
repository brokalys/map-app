import React, { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { Header, Statistic } from "semantic-ui-react";
import { gql, useQuery } from "@apollo/client";
import moment from "moment";

import FilterContext from "context/FilterContext";
import useBrokalysStaticApi from "hooks/use-brokalys-static-api";
import styles from "./CurrentMonthOverview.module.css";

const GET_MEDIAN_PRICE = gql`
  query(
    $type: String!
    $category: String!
    $current_month_start: String!
    $last_month_start: String!
    $last_month_end: String!
    $last_year_start: String!
    $last_year_end: String!
    $region: [String!]!
  ) {
    current_month: properties(
      filter: {
        category: { eq: $category }
        type: { eq: $type }
        published_at: { gte: $current_month_start }
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

const currentMonth = moment().utc().clone().startOf("month");

function MedianPrice({ loading, data }) {
  if (loading) {
    return <Skeleton height={42} />;
  }

  console.log(data);
  const median = data.price;
  const momChange = data.priceChange.mom;
  const yoyChange = data.priceChange.yoy;

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

function RentalYieldValue({ category, location }) {
  const { loading, data: value } = useRentalYield(category, location);

  if (loading) {
    return <Skeleton height={40} />;
  }

  return <Statistic.Value>{value.toFixed(2)}%</Statistic.Value>;
}

function useLastPrice(category, type, location) {
  const [{ loading, error, data }] = useBrokalysStaticApi(
    category,
    type,
    location
  );
  const last = data[data.length - 1];

  return {
    loading,
    error,
    data: last ? last.price : 0,
  };
}

function useRentalYield(category, location) {
  const { loading: rentLoading, data: rentPrice } = useLastPrice(
    category,
    "rent",
    location
  );

  const { loading: sellLoading, data: sellPrice } = useLastPrice(
    category,
    "sell",
    location
  );

  return {
    loading: rentLoading || sellLoading,
    data: (rentPrice / sellPrice) * 100,
  };
}

function useCurrentMonthStatistics(category, type, location) {
  const [{ loading, data }] = useBrokalysStaticApi(category, type, location);

  if (loading) {
    return { loading };
  }

  const lastMonth = data[data.length - 1];
  const monthBefore = data[data.length - 2];
  const yearAgo = data[data.length - 13];

  return {
    loading,
    data: {
      price: lastMonth.price,
      priceChange: {
        mom: (1 - lastMonth.price / monthBefore.price) * 100,
        yoy: (1 - lastMonth.price / yearAgo.price) * 100,
      },
    },
  };
}

function CurrentMonthOverview() {
  const context = useContext(FilterContext);

  const { loading: loadingPrice, data: dataPrice } = useCurrentMonthStatistics(
    context.category.selected,
    context.type.selected,
    context.location.selected
  );

  const { loading, data } = useQuery(GET_MEDIAN_PRICE, {
    variables: {
      type: context.type.selected,
      category: context.category.selected,
      current_month_start: currentMonth.toISOString(),
      last_month_start: currentMonth.clone().subtract(1, "month").toISOString(),
      last_month_end: currentMonth
        .clone()
        .subtract(1, "month")
        .add(1, "month")
        .toISOString(),
      last_year_start: currentMonth.clone().subtract(1, "year").toISOString(),
      last_year_end: currentMonth
        .clone()
        .subtract(1, "year")
        .add(1, "month")
        .toISOString(),
      region: [context.location.selectedRegion],
    },
  });

  return (
    <div>
      <Header as="h3">Current Month</Header>

      <Statistic.Group size="small">
        <Statistic>
          <Statistic.Value>
            <MedianPrice loading={loadingPrice} data={dataPrice} />
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

        <Statistic>
          <RentalYieldValue
            location={context.location.selected}
            category={context.category.selected}
          />
          <Statistic.Label>Rental Yield</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    </div>
  );
}

export default CurrentMonthOverview;
