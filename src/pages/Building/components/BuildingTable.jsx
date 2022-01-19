import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import { Pagination, Table } from 'semantic-ui-react';

import useActiveRegionBuildings from 'src/hooks/use-active-region-buildings';
import useQuerystringParam from 'src/hooks/use-querystring-param';

import BuildingStats from './BuildingStats';
import styles from './BuildingTable.module.css';

const RENT_TYPE_SUFFIX = {
  yearly: '/y',
  monthly: '/m',
  weekly: '/w',
  daily: '/d',
  hourly: '/h',
};

const columns = [
  {
    Header: 'Category',
    accessor: 'category',
    filter: 'equals',
  },
  {
    Header: 'Type',
    accessor: 'type',
    filter: 'equals',
  },
  {
    accessor: 'rent_type',
    filter: 'equals',
  },
  {
    Header: 'Total price',
    Cell: ({ row: { original } }) => (
      <>
        {original.price.toLocaleString()} €
        {original.type === 'rent' && RENT_TYPE_SUFFIX[original.rent_type]}
      </>
    ),
    accessor: 'price',
  },
  {
    Header: 'SQM Price',
    Cell: ({ value }) => {
      if (!value) {
        return null;
      }

      return (
        <>
          {Math.round(value).toLocaleString()} €/m
          <sup>2</sup>
        </>
      );
    },
    accessor: 'calc_price_per_sqm',
  },
  {
    Header: 'Area',
    Cell: ({ value }) => {
      if (!value) {
        return null;
      }

      return (
        <>
          {value.toLocaleString()} m<sup>2</sup>
        </>
      );
    },
    accessor: 'area',
  },
  {
    Header: 'Rooms',
    accessor: 'rooms',
  },
  {
    Header: 'Published at',
    Cell: ({ value }) =>
      value ? moment(value).format('YYYY-MM-DD HH:mm') : 'Before 2018',
    accessor: 'published_at',
  },
];

function getCellTextAlign(cell) {
  if (['category', 'type'].includes(cell.column.id)) {
    return 'left';
  }

  return 'right';
}

function usePageSize() {
  const [page, setPage] = useQuerystringParam('page');
  return [parseInt(page || 1, 10) - 1, setPage];
}

function useActiveRegionBuildingPrices(filters) {
  const { loading, error, data } = useActiveRegionBuildings();
  const classifieds = data.reduce(
    (carry, { properties }) => [...carry, ...properties.results],
    [],
  );
  const filteredClassifieds = classifieds.filter((classified) =>
    filters
      .filter(({ value }) => !!value)
      .reduce(
        (carry, { id, value }) => carry && classified[id] === value,
        true,
      ),
  );

  const regionPrices = {
    total: filteredClassifieds.reduce(
      (carry, { price }) => [...carry, price],
      [],
    ),
    sqm: filteredClassifieds.reduce(
      (carry, { calc_price_per_sqm: price }) => [...carry, price],
      [],
    ),
  };

  return {
    loading,
    error,
    data: regionPrices,
  };
}

function useQuerystringFilters() {
  const [category] = useQuerystringParam('category');
  const [type] = useQuerystringParam('type');
  const [rentType] = useQuerystringParam('rent_type');

  return useMemo(
    () => [
      { id: 'category', value: category },
      { id: 'type', value: type },
      { id: 'rent_type', value: type === 'rent' ? rentType : undefined },
    ],
    [category, type, rentType],
  );
}

export default function BuildingTable(props) {
  const filters = useQuerystringFilters();
  const [pageIndex, updatePageIndex] = usePageSize();
  const {
    setFilter,
    headerGroups,
    rows,
    page,
    prepareRow,

    // Pagination
    pageCount,
    gotoPage,
  } = useTable(
    {
      columns,
      data: props.building.properties.results,
      initialState: {
        sortBy: [
          {
            id: 'published_at',
            desc: true,
          },
        ],
        pageSize: 15,
        pageIndex,
        hiddenColumns: ['rent_type'],
        filters,
      },
      autoResetFilters: false,
    },
    useFilters,
    useSortBy,
    usePagination,
  );
  const regionPrices = useActiveRegionBuildingPrices(filters);

  useEffect(() => {
    gotoPage(pageIndex);
  }, [gotoPage, pageIndex]);

  useEffect(() => {
    filters.forEach(({ id, value }) => setFilter(id, value));
  }, [filters, setFilter]);

  const prices = useMemo(
    () => ({
      total: rows
        .map(({ original }) => original.price)
        .filter((price) => price > 0),
      sqm: rows
        .map(({ original }) => original.calc_price_per_sqm)
        .filter((price) => price > 0),
    }),
    [rows],
  );

  const hasResults = page.length > 0;

  return (
    <>
      {hasResults && (
        <div className={styles.stats}>
          <BuildingStats prices={prices} regionPrices={regionPrices} />
        </div>
      )}
      <Table singleLine={hasResults} sortable>
        <Table.Header>
          {headerGroups.map((headerGroup) => (
            <Table.Row
              textAlign="center"
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <Table.HeaderCell
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  sorted={
                    column.isSorted
                      ? column.isSortedDesc
                        ? 'descending'
                        : 'ascending'
                      : null
                  }
                >
                  {column.render('Header')}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>

        <Table.Body>
          {page.map((row) => {
            prepareRow(row);
            return (
              <Table.Row {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Table.Cell
                    textAlign={getCellTextAlign(cell)}
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </Table.Cell>
                ))}
              </Table.Row>
            );
          })}
          {!hasResults && (
            <Table.Row>
              <Table.Cell colSpan={columns.length} textAlign="center">
                <p>
                  <strong>
                    No classifieds could be found with the given filters.
                  </strong>{' '}
                  Clear the filters or open a different property to see data.
                </p>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>

        {pageCount > 1 && (
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan={columns.length}>
                <Pagination
                  activePage={pageIndex + 1}
                  boundaryRange={1}
                  onPageChange={(event, data) =>
                    updatePageIndex(data.activePage)
                  }
                  size="mini"
                  siblingRange={2}
                  totalPages={pageCount}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        )}
      </Table>
    </>
  );
}
