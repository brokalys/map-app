import moment from 'moment';
import { useCallback, useEffect, useMemo } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import type { Column, UseTableCellProps } from 'react-table';
import { Pagination, Table } from 'semantic-ui-react';

import useBuildingFilters from 'src/hooks/use-building-filters';
import type { Building } from 'src/types/building';
import type { Property } from 'src/types/property';
import type { VZDProperty } from 'src/types/vzd';

import BuildingStats from './BuildingStats';
import styles from './BuildingTable.module.css';

const RENT_TYPE_SUFFIX: Record<string, string> = {
  yearly: '/y',
  monthly: '/m',
  weekly: '/w',
  daily: '/d',
  hourly: '/h',
};

type DataFormat = Property | VZDProperty;

const columns: Column<DataFormat>[] = [
  {
    Header: 'Source',
    accessor: 'source',
    filter: 'equals',
  },
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
    Cell: (props) => (
      <>
        {props.row.original.price.toLocaleString()} €
        {props.row.original.type === 'rent' &&
          RENT_TYPE_SUFFIX[props.row.original.rent_type]}
      </>
    ),
    accessor: 'price',
  },
  {
    Header: 'SQM Price',
    Cell: (props) => {
      if (!props.value) {
        return null;
      }

      return (
        <>
          {Math.round(props.value).toLocaleString()} €/m
          <sup>2</sup>
        </>
      );
    },
    accessor: 'calc_price_per_sqm',
  },
  {
    Header: 'Area',
    Cell: (props) => {
      if (!props.value) {
        return null;
      }

      return (
        <>
          {props.value.toLocaleString()} m<sup>2</sup>
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
    Header: 'Floor',
    accessor: 'floor_min',
    Cell: (props) => {
      const { floor_min, floor_max } = props.row.original;
      const isFloorMinNumber = typeof floor_min === 'number';
      const isFloorMaxNumber = typeof floor_max === 'number';

      if (!isFloorMinNumber) {
        if (isFloorMaxNumber) {
          return <>{floor_max}</>;
        }
        return null;
      }

      if (isFloorMaxNumber && floor_min !== floor_max) {
        return (
          <>
            {floor_min} - {floor_max}
          </>
        );
      }

      return <>{floor_min}</>;
    },
  },
  {
    Header: 'Date',
    Cell: (props) =>
      props.value ? (
        <>{moment(props.value).format('YYYY-MM-DD HH:mm')}</>
      ) : props.row.original.source === 'classifieds' ? (
        <>Before 2018</>
      ) : null,
    accessor: 'date',
  },
];

function getCellTextAlign(cell: UseTableCellProps<DataFormat>) {
  if (['category', 'type'].includes(cell.column.id)) {
    return 'left';
  }

  return 'right';
}

function usePageSize() {
  const [{ page }, setQuery] = useBuildingFilters();
  const setPage = useCallback(
    (newPage: number) => {
      setQuery({ page: newPage });
    },
    [setQuery],
  );
  return [page - 1, setPage] as const;
}

function useQuerystringFilters() {
  const [{ source, category, type, rent_type: rentType }] =
    useBuildingFilters();

  return useMemo(
    () => [
      { id: 'source', value: source },
      { id: 'category', value: category },
      {
        id: 'type',
        value: source !== 'real-sales' ? type : undefined,
      },
      {
        id: 'rent_type',
        value:
          source !== 'real-sales' && type === 'rent' ? rentType : undefined,
      },
    ],
    [source, category, type, rentType],
  );
}

interface BuildingTableProps {
  building: (Building & { data: DataFormat[] }) | undefined;
}

const BuildingTable: React.FC<BuildingTableProps> = (props) => {
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
  } = useTable<DataFormat>(
    {
      columns,
      data: props.building?.data || [],
      initialState: {
        sortBy: [
          {
            id: 'date',
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
          <BuildingStats prices={prices} />
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
                      : undefined
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
                    No data could be found with the given filters.
                  </strong>{' '}
                  Clear the filters or open a different building to see data.
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
                    updatePageIndex(Number(data.activePage))
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
};

export default BuildingTable;
