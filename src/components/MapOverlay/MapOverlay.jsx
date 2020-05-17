import React, { useContext, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { gql } from "@apollo/client";
import { Grid, Header } from "semantic-ui-react";
import moment from "moment";

import MapContext from "context/MapContext";
import useDebouncedQuery from "hooks/use-debounced-query";
import AreaOverview from "./components/AreaOverview";
import PropertyPriceLine from "./components/PropertyPriceLine";
import PropertyTypeChart from "./components/PropertyTypeChart";

import styles from "./MapOverlay.module.css";

const GET_MEDIAN_PRICE = gql`
  query($type: String!, $date: String!, $region: [String!]!) {
    properties(
      filter: {
        type: { eq: $type }
        published_at: { gte: $date }
        region: { in: $region }
      }
    ) {
      summary {
        price {
          median
        }
      }
    }
  }
`;

function PriceLabel({ price }) {
  if (!price) {
    return "Unknown";
  }

  return parseInt(price, 10).toLocaleString("en");
}

function MapOverlay() {
  const map = useContext(MapContext);
  const [startDate] = useState(
    moment().subtract(30, "days").format("YYYY-MM-DD")
  );
  const [type] = useState("SELL"); // @todo: dynamic
  const { loading, error, data } = useDebouncedQuery(
    GET_MEDIAN_PRICE,
    {
      variables: {
        type: type,
        date: startDate,
        region: [map.region],
      },
    },
    1000
  );

  const isLoading = loading || !data;

  if (error) {
    return (
      <div className={styles.container}>
        <Header as="h4">
          An unexpected error occured when attempting to fetch the data. Try
          again later.
        </Header>
      </div>
    );
  }

  return (
    <div className={styles.container} id="map-overlay">
      <Grid>
        <Grid.Column computer={8}>
          <AreaOverview>
            {isLoading ? (
              <Skeleton />
            ) : (
              <PriceLabel price={data.properties.summary.price.median} />
            )}
          </AreaOverview>

          <PropertyPriceLine type={type} />
        </Grid.Column>
        <Grid.Column computer={8}>
          <PropertyTypeChart type={type} startDate={startDate} />
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default MapOverlay;
