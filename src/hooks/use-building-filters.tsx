import type { QueryParamConfig } from 'serialize-query-params';
import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';

export default function useBuildingFilters() {
  return useQueryParams<{
    page: QueryParamConfig<number>;
    source: QueryParamConfig<string | undefined>;
    category: QueryParamConfig<string | undefined>;
    type: QueryParamConfig<string | undefined>;
    rent_type: QueryParamConfig<string | undefined>;
  }>({
    page: withDefault(NumberParam, 1),
    source: withDefault(StringParam, undefined),
    category: withDefault(StringParam, undefined),
    type: withDefault(StringParam, undefined),
    rent_type: withDefault(StringParam, undefined),
  });
}
