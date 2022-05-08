import { Dropdown, Menu } from 'semantic-ui-react';

import useBuildingFilters from 'src/hooks/use-building-filters';

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
  const [{ source, category, type, rent_type: rentType }, setQuery] =
    useBuildingFilters();

  return (
    <>
      <Menu.Item fitted>
        <Dropdown
          placeholder="Select data source"
          clearable
          selection
          value={source}
          options={sourceOptions}
          onChange={(event, data) =>
            setQuery({ ...resetPage, source: String(data.value) || undefined })
          }
        />
      </Menu.Item>
      <Menu.Item fitted>
        <Dropdown
          placeholder="Select category"
          clearable
          selection
          value={category}
          options={categoryOptions}
          onChange={(event, data) =>
            setQuery({
              ...resetPage,
              category: String(data.value) || undefined,
            })
          }
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
              onChange={(event, data) =>
                setQuery({
                  ...resetPage,
                  type: String(data.value) || undefined,
                })
              }
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
                onChange={(event, data) =>
                  setQuery({
                    ...resetPage,
                    rent_type: String(data.value) || undefined,
                  })
                }
              />
            </Menu.Item>
          )}
        </>
      )}
    </>
  );
}
