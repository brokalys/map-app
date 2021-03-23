import { riga } from '@brokalys/location-json-schemas';
import React from 'react';
import { useRecoilState } from 'recoil';
import { Dropdown, Menu } from 'semantic-ui-react';
import { transliterate } from 'transliteration';

import {
  getCategoryFilter,
  getLocationFilter,
  getTypeFilter,
  getPriceTypeFilter,
} from 'store';
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
  const [, setLocation] = useRecoilState(getLocationFilter);
  const [, setCategory] = useRecoilState(getCategoryFilter);
  const [, setType] = useRecoilState(getTypeFilter);
  const [, setPriceType] = useRecoilState(getPriceTypeFilter);

  /**
   * Improved search operation to ignore all UTF-8 characters.
   */
  function onSearch(all, selected) {
    const regexp = new RegExp(
      transliterate(selected).replace(/[^a-z\s-]/gi, ''),
      'i',
    );
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
            onChange={(event, data) => setLocation(data.value)}
          />
        </Menu.Item>
        <Menu.Item fitted>
          <Dropdown
            placeholder="Select category"
            fluid
            selection
            defaultValue="apartment"
            options={categoryOptions}
            onChange={(event, data) => setCategory(data.value)}
          />
        </Menu.Item>
        <Menu.Item fitted>
          <Dropdown
            placeholder="Select type"
            fluid
            selection
            defaultValue="sell"
            options={typeOptions}
            onChange={(event, data) => setType(data.value)}
          />
        </Menu.Item>

        <Menu.Item fitted>
          <Dropdown
            placeholder="Select price type"
            fluid
            selection
            defaultValue="total"
            options={priceTypeOptions}
            onChange={(event, data) => setPriceType(data.value)}
          />
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default FilterToolbar;
