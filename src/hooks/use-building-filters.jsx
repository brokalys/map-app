import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';

export default function useBuildingFilters() {
  return useQueryParams({
    page: withDefault(NumberParam, 1),
    source: StringParam,
    category: StringParam,
    type: StringParam,
    rent_type: StringParam,
  });
}
