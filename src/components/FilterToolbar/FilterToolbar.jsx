import React from "react";
import { useRecoilState } from "jared-recoil";
import { Dropdown, Menu } from "semantic-ui-react";
import { transliterate } from "transliteration";

import rigaGeojson from "data/riga-geojson.json";
import { filterState } from "store";
import styles from "./FilterToolbar.module.css";

const locationOptions = rigaGeojson.features.map((row) => ({
  value: row.properties.apkaime,
  text: row.properties.apkaime,
}));

const categoryOptions = [
  { value: "apartment", text: "Apartment" },
  { value: "house", text: "House" },
  { value: "land", text: "Land" },
];
const typeOptions = [
  { value: "sell", text: "Sell" },
  { value: "rent", text: "Rent" },
];

function FilterToolbar() {
  const [, setFilters] = useRecoilState(filterState);

  function onLocationChange(event, data) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      location: data.value,
    }));
  }

  function onCategoryChange(event, data) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      category: data.value,
    }));
  }

  function onTypeChange(event, data) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      type: data.value,
    }));
  }

  /**
   * Improved search operation to ignore all UTF-8 characters.
   */
  function onSearch(all, selected) {
    const regexp = new RegExp(transliterate(selected), "i");
    return all.filter((row) => regexp.test(transliterate(row.text)));
  }

  return (
    <div className={styles.container}>
      <Menu secondary>
        <Menu.Item fitted>
          <Dropdown
            placeholder="Select location"
            search={onSearch}
            selection
            defaultValue="Centrs"
            options={locationOptions}
            onChange={onLocationChange}
          />
        </Menu.Item>
        <Menu.Item fitted>
          <Dropdown
            placeholder="Select category"
            fluid
            selection
            defaultValue="apartment"
            options={categoryOptions}
            onChange={onCategoryChange}
          />
        </Menu.Item>
        <Menu.Item fitted>
          <Dropdown
            placeholder="Select type"
            fluid
            selection
            defaultValue="sell"
            options={typeOptions}
            onChange={onTypeChange}
          />
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default FilterToolbar;
