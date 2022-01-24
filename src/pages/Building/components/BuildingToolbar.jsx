import { Dropdown, Menu } from 'semantic-ui-react';

import useQuerystringParam from 'src/hooks/use-querystring-param';

const sourceOptions = [
  { value: 'real-sales', text: 'Real Sales' },
  { value: 'classifieds', text: 'Classifieds' },
];
const categoryOptions = [
  { value: 'apartment', text: 'Apartment' },
  { value: 'house', text: 'House' },
  { value: 'premise', text: 'Premise' },
];
const typeOptions = [
  { value: 'sell', text: 'Sell' },
  { value: 'rent', text: 'Rent' },
  { value: 'auction', text: 'Auction' },
];
const rentTypeOptions = [
  { value: 'yearly', text: 'Yearly' },
  { value: 'monthly', text: 'Monthly' },
  { value: 'weekly', text: 'Weekly' },
  { value: 'daily', text: 'Daily' },
];

const resetPage = {
  page: undefined,
};

export default function BuildingToolbar() {
  const [source, setSource] = useQuerystringParam('source', resetPage);
  const [category, setCategory] = useQuerystringParam('category', resetPage);
  const [type, setType] = useQuerystringParam('type', resetPage);
  const [rentType, setRentType] = useQuerystringParam('rent_type', resetPage);

  return (
    <>
      <Menu.Item fitted>
        <Dropdown
          placeholder="Select data source"
          clearable
          selection
          value={source}
          options={sourceOptions}
          onChange={(event, data) => setSource(data.value)}
        />
      </Menu.Item>
      <Menu.Item fitted>
        <Dropdown
          placeholder="Select category"
          clearable
          selection
          value={category}
          options={categoryOptions}
          onChange={(event, data) => setCategory(data.value)}
        />
      </Menu.Item>

      {source !== 'real-sales' && (
        <>
          <Menu.Item fitted>
            <Dropdown
              placeholder="Select type"
              clearable
              selection
              value={type}
              options={typeOptions}
              onChange={(event, data) => setType(data.value)}
            />
          </Menu.Item>

          {type === 'rent' && (
            <Menu.Item fitted>
              <Dropdown
                placeholder="Select rent type"
                clearable
                selection
                fluid
                value={rentType}
                options={rentTypeOptions}
                onChange={(event, data) => setRentType(data.value)}
              />
            </Menu.Item>
          )}
        </>
      )}
    </>
  );
}
