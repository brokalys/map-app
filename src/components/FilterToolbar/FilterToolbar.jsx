import { riga } from '@brokalys/location-json-schemas';
import React from 'react';
import { useRecoilState } from 'recoil';
import { Dropdown, Menu } from 'semantic-ui-react';
import { transliterate } from 'transliteration';

import { filterState } from 'store';
import styles from './FilterToolbar.module.css';

const locationOptions = riga.features.map((row) => ({
  value: row.properties.id,
  text: row.properties.name,
}));

const categoryOptions = [
  { value: 'apartment', text: 'Apartment' },
  { value: 'house', text: 'House' },
  { value: 'land', text: 'Land' },
];
const typeOptions = [
  { value: 'sell', text: 'Sell' },
  { value: 'rent', text: 'Rent' },
];
const priceTypeOptions = [
  { value: 'total', text: 'Total price' },
  { value: 'sqm', text: 'Price/sqm' },
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

  function onPriceTypeChange(event, data) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      priceType: data.value,
    }));
  }

  /**
   * Improved search operation to ignore all UTF-8 characters.
   */
  function onSearch(all, selected) {
    const regexp = new RegExp(transliterate(selected), 'i');
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
            defaultValue="latvia-riga-vecpilseta"
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

        <Menu.Item fitted>
          <Dropdown
            placeholder="Select price type"
            fluid
            selection
            defaultValue="total"
            options={priceTypeOptions}
            onChange={onPriceTypeChange}
          />
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default FilterToolbar;