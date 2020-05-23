import React from "react";
import { useRecoilState } from "recoil";
import { Header, Statistic } from "semantic-ui-react";

import FilterToolbar from "components/FilterToolbar";
import Navigation from "components/Navigation";
import PropertyPriceChart from "components/PropertyPriceChart";
import MedianPrice from "components/Statistics/MedianPriceInFilterLocation";
import RentalYield from "components/Statistics/RentalYieldInFilterLocation";
import filterState from "recoil/filters";

import styles from "./SplitPaneLeft.module.css";

function SplitPaneLeft() {
  const [filters] = useRecoilState(filterState);

  return (
    <div className={styles.container}>
      <Navigation />

      <div className={styles.content}>
        <Header as="h2">
          Median Prices in{" "}
          <span className={styles.highlightedText}>{filters.location}</span>
        </Header>

        <FilterToolbar />
        <PropertyPriceChart />

        <div>
          <Header as="h3">Last Month</Header>

          <Statistic.Group size="small">
            <MedianPrice />
            <RentalYield />
          </Statistic.Group>
        </div>
      </div>
    </div>
  );
}

export default SplitPaneLeft;
