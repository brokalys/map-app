import React, { useState } from "react";
import { Header } from "semantic-ui-react";

import FilterToolbar from "components/FilterToolbar";
import Navigation from "components/Navigation";
import PropertyPriceChart from "components/PropertyPriceChart";
import LastThirtyDayOverview from "containers/LastThirtyDayOverview";
import FilterContext from "context/FilterContext";
import rigaGeojson from "data/riga-geojson.json";

import styles from "./SplitPaneLeft.module.css";

const locationOptions = rigaGeojson.features.map((row) => ({
  value: row.properties.apkaime,
  text: row.properties.apkaime,
}));

const categoryOptions = [
  { value: "Apartment", text: "Apartment" },
  { value: "House", text: "House" },
  { value: "Land", text: "Land" },
];
const typeOptions = [
  { value: "Sell", text: "Sell" },
  { value: "Rent", text: "Rent" },
];

function SplitPaneLeft() {
  const [filterState, setFilterState] = useState({
    location: {
      options: locationOptions,
      default: "Centrs",
      selected: "Centrs",
      setSelected(selected) {
        setFilterState((state) => ({
          ...state,
          location: {
            ...state.location,
            selected,
          },
        }));
      },
    },
    category: {
      options: categoryOptions,
      default: "Apartment",
      selected: "Apartment",
      setSelected(selected) {
        setFilterState((state) => ({
          ...state,
          category: {
            ...state.category,
            selected,
          },
        }));
      },
    },
    type: {
      options: typeOptions,
      default: "Sell",
      selected: "Sell",
      setSelected(selected) {
        setFilterState((state) => ({
          ...state,
          type: {
            ...state.type,
            selected,
          },
        }));
      },
    },
  });

  return (
    <div className={styles.container}>
      <Navigation />

      <FilterContext.Provider value={filterState} className={styles.content}>
        <Header as="h2">
          Average Prices in{" "}
          <span className={styles.highlightedText}>
            {filterState.location.selected}
          </span>
        </Header>

        <FilterToolbar />
        <PropertyPriceChart />
        <LastThirtyDayOverview />
      </FilterContext.Provider>
    </div>
  );
}

export default SplitPaneLeft;
