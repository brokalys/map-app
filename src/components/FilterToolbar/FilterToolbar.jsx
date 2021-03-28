import { riga } from '@brokalys/location-json-schemas';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Menu } from 'semantic-ui-react';
import { transliterate } from 'transliteration';
import { setNeighborhoodFilters, setSelectedNeighborhood } from 'store/actions';
import {
  neighborhoodFilterSelector,
  selectedNeighborhoodSelector,
} from 'store/selectors';
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
  const dispatch = useDispatch();
  const { category, type, price } = useSelector(neighborhoodFilterSelector);
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
            value={neighborhood}
            onChange={(event, data) =>
              dispatch(setSelectedNeighborhood(data.value))
            }
          />
        </Menu.Item>
        <Menu.Item fitted>
          <Dropdown
            placeholder="Select category"
            fluid
            selection
            value={category}
            options={categoryOptions}
            onChange={(event, data) =>
              dispatch(setNeighborhoodFilters({ category: data.value }))
            }
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
