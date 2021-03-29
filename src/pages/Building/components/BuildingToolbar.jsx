import { useEffect, useMemo, useState } from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';

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

export default function BuildingToolbar({ onChange }) {
  const [category, setCategory] = useState();
  const [type, setType] = useState();
  const [rentType, setRentType] = useState();
  const filters = useMemo(
    () => ({
      category: category || undefined,
      type: type || undefined,
      rent_type: type === 'rent' ? rentType || undefined : undefined,
    }),
    [category, type, rentType],
  );

  useEffect(() => {
    onChange(filters);
  }, [onChange, filters]);

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
