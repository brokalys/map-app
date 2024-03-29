import { latvia, riga } from '@brokalys/location-json-schemas';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Dropdown, Input, Menu } from 'semantic-ui-react';
import type { DropdownItemProps } from 'semantic-ui-react';
import { transliterate } from 'transliteration';

import getRegionData from 'src/common/get-region-data';
import useChartFilters from 'src/hooks/use-price-chart-filters';

import styles from './FilterToolbar.module.css';

const RIGA_LOCATION_ID = 'latvia-riga';
const MIN_DATE = new Date('1998-01-01');
const MAX_DATE = new Date();

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

const toISOIgnoreTimezone = (inputDate: Date) => {
  return new Date(
    inputDate.getFullYear() +
      '-' +
      ('0' + (inputDate.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + inputDate.getDate()).slice(-2) +
      'T00:00:00.000Z',
  );
};

function FilterToolbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [
    { category, type, priceType, source, neighborhood, start: startDate },
    setQuery,
  ] = useChartFilters();

  function setNeighborhood(id: string) {
    // Center the map on the newly selected neighborhood and highlight it
    const region = getRegionData(id);

    if (!region) {
      return;
    }

    const {
      centerCoords: { lat, lng },
    } = region;

    searchParams.set('neighborhood', id);
    navigate({
      pathname: `/${lat},${lng},13`,
      search: searchParams.toString(),
    });
  }

  /**
   * Improved search operation to ignore all UTF-8 characters.
   */
  function onSearch(all: DropdownItemProps[], selected: string) {
    const regexp = new RegExp(
      transliterate(selected).replace(/[^a-z\s-]/gi, ''),
      'i',
    );
    return all.filter((row) => regexp.test(transliterate(String(row.text))));
  }

  return (
    <div className={styles.container}>
      <Menu secondary className={styles.primaryToolbar}>
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
            selectOnBlur={false}
            onChange={(event, data) => setNeighborhood(String(data.value))}
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
              selectOnBlur={false}
              onChange={(event, data) => setNeighborhood(String(data.value))}
            />
          </Menu.Item>
        )}
      </Menu>

      <Menu secondary className={styles.secondaryToolbar}>
        <Menu.Item fitted>
          <Dropdown
            placeholder="Select data source"
            fluid
            selection
            value={source}
            options={sourceOptions}
            selectOnBlur={false}
            onChange={(event, data) => {
              const filters = Object.assign(
                {},
                { source: String(data.value) },
                data.value === 'real-sales' ? { type: 'sell' } : {},
              );

              setQuery(filters);
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
            selectOnBlur={false}
            onChange={(event, data) => {
              const filters = Object.assign(
                {},
                { category: String(data.value) },
                data.value === 'land' ? { type: 'sell' } : {},
              );

              setQuery(filters);
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
            selectOnBlur={false}
            onChange={(event, data) => {
              setQuery({ type: String(data.value) });
            }}
            disabled={source === 'real-sales' || category === 'land'}
          />
        </Menu.Item>

        <Menu.Item fitted>
          <Dropdown
            placeholder="Select price type"
            fluid
            selection
            value={priceType}
            options={priceTypeOptions}
            selectOnBlur={false}
            onChange={(event, data) => {
              setQuery({ priceType: String(data.value) });
            }}
          />
        </Menu.Item>

        {source === 'real-sales' && (
          <Menu.Item fitted position="right">
            <DatePicker
              selected={startDate}
              onChange={(date: Date) =>
                setQuery({ start: toISOIgnoreTimezone(date) })
              }
              startDate={startDate}
              dateFormat="yyyy, QQQ"
              showQuarterYearPicker
              customInput={<CustomDateInput />}
              minDate={MIN_DATE}
              maxDate={MAX_DATE}
            />
          </Menu.Item>
        )}
      </Menu>
    </div>
  );
}

const CustomDateInput = React.forwardRef(
  (
    // @ts-expect-error
    { value, onClick }: unknown,
    ref: React.Ref<HTMLInputElement>,
  ) => (
    <Input
      icon="calendar"
      label={{ content: 'starting from' }}
      labelPosition="left"
      value={value}
      onClick={onClick}
    />
  ),
);

export default FilterToolbar;
