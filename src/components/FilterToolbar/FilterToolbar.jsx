import React from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';

import styles from './FilterToolbar.module.css';

const locationOptions = [
  { value: 'mezaparks', text: 'Mežaparks' },
  { value: 'agenskalns', text: 'Āgenskalns' },
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

function FilterToolbar() {
  return (
    <div className={styles.container}>
      <Menu secondary>
        <Menu.Item fitted>
          <Dropdown
            placeholder='Select location'
            fluid
            search
            selection
            defaultValue={'agenskalns'}
            options={locationOptions}
          />
        </Menu.Item>
        <Menu.Item fitted>
          <Dropdown
            placeholder='Select category'
            fluid
            selection
            defaultValue={'apartment'}
            options={categoryOptions}
          />
        </Menu.Item>
        <Menu.Item fitted>
          <Dropdown
            placeholder='Select type'
            fluid
            selection
            defaultValue={'sell'}
            options={typeOptions}
          />
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default FilterToolbar;
