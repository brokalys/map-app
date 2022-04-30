import { latvia, riga } from '@brokalys/location-json-schemas';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Menu } from 'semantic-ui-react';
import { transliterate } from 'transliteration';

import {
  setNeighborhoodFilters,
  setSelectedNeighborhood,
} from 'src/store/actions';
import {
  neighborhoodFilterSelector,
  selectedNeighborhoodSelector,
} from 'src/store/selectors';

import styles from './FilterToolbar.module.css';

const RIGA_LOCATION_ID = 'latvia-riga';

const locationOptions = latvia.features
  .filter(
    (row) => row.properties.Level > 1 || row.properties.id === RIGA_LOCATION_ID,
  )
  // @todo: enable once API supports these
  .filter(
    (row) =>
      !row.properties.name.includes('pagasts') &&
      !row.properties.name.includes('novads'),
  )
  .sort((a, b) => a.properties.name.localeCompare(b.properties.name))
  .map((row) => ({
    value: row.properties.id,
    text: row.properties.name,
  }));
const rigaOptions = riga.features.map((row) => ({
  value: row.properties.id,
  text: row.properties.name,
}));

const sourceOptions = [
  { value: 'classifieds', text: 'Classifieds' },
  { value: 'real-sales', text: 'Real sales' },
];
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
  const dispatch = useDispatch();
  const { category, type, price, source } = useSelector(
    neighborhoodFilterSelector,
  );
  const { id: neighborhood } = useSelector(selectedNeighborhoodSelector);

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
            options={locationOptions}
            value={
              neighborhood.startsWith(RIGA_LOCATION_ID)
                ? RIGA_LOCATION_ID
                : neighborhood
            }
            onChange={(event, data) =>
              dispatch(setSelectedNeighborhood(data.value))
            }
          />
        </Menu.Item>

        {neighborhood.startsWith(RIGA_LOCATION_ID) && (
          <Menu.Item fitted>
            <Dropdown
              placeholder="Select neighborhood"
              search={onSearch}
              selection
              options={rigaOptions}
              value={neighborhood}
              onChange={(event, data) =>
                dispatch(setSelectedNeighborhood(data.value))
              }
            />
          </Menu.Item>
        )}
      </Menu>

      <Menu secondary>
        <Menu.Item fitted>
          <Dropdown
            placeholder="Select data source"
            fluid
            selection
            value={source}
            options={sourceOptions}
            onChange={(event, data) => {
              const filters = Object.assign(
                {},
                { source: data.value },
                data.value === 'real-sales' ? { type: 'sell' } : {},
              );
              dispatch(setNeighborhoodFilters(filters));
            }}
          />
        </Menu.Item>
        <Menu.Item fitted className={styles.categoryDropdown}>
          <Dropdown
            placeholder="Select category"
            fluid
            selection
            value={category}
            options={categoryOptions}
            onChange={(event, data) => {
              const filters = Object.assign(
                {},
                { category: data.value },
                data.value === 'land' ? { type: 'sell' } : {},
              );
              dispatch(setNeighborhoodFilters(filters));
            }}
          />
        </Menu.Item>

        <Menu.Item fitted>
          <Dropdown
            placeholder="Select type"
            fluid
            selection
            value={type}
            options={typeOptions}
            onChange={(event, data) =>
              dispatch(setNeighborhoodFilters({ type: data.value }))
            }
            disabled={source === 'real-sales' || category === 'land'}
          />
        </Menu.Item>

        <Menu.Item fitted>
          <Dropdown
            placeholder="Select price type"
            fluid
            selection
            value={price}
            options={priceTypeOptions}
            onChange={(event, data) =>
              dispatch(setNeighborhoodFilters({ price: data.value }))
            }
          />
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default FilterToolbar;
