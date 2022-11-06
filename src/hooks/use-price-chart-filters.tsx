import type { QueryParamConfig } from 'serialize-query-params';
import {
  BooleanParam,
  DateParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';

export default function useChartFilters() {
  return useQueryParams<{
    neighborhood: QueryParamConfig<string>;
    category: QueryParamConfig<string>;
    type: QueryParamConfig<string>;
    priceType: QueryParamConfig<string>;
    source: QueryParamConfig<string>;
    outliers: QueryParamConfig<boolean>;
    start: QueryParamConfig<Date>;
  }>({
    neighborhood: withDefault(StringParam, 'latvia-riga-vecpilseta'),
    category: withDefault(StringParam, 'apartment'),
    type: withDefault(StringParam, 'sell'),
    priceType: withDefault(StringParam, 'sqm'),
    source: withDefault(StringParam, 'classifieds'),
    outliers: withDefault(BooleanParam, false),
    start: withDefault(DateParam, new Date('2013-01-01')),
  });
}
