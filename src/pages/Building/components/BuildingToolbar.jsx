import { Dropdown, Menu } from 'semantic-ui-react';
import useQuerystringParam from 'hooks/use-querystring-param';

const categoryOptions = [
  { value: 'apartment', text: 'Apartment' },
  { value: 'house', text: 'House' },
  { value: 'office', text: 'Office' },
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
  const [category, setCategory] = useQuerystringParam('category', resetPage);
  const [type, setType] = useQuerystringParam('type', resetPage);
  const [rentType, setRentType] = useQuerystringParam('rent_type', resetPage);

  return (
    <>
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
  );
}
