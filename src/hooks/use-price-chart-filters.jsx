import {
  BooleanParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';

export default function useChartFilters() {
  return useQueryParams({
    neighborhood: withDefault(StringParam, 'latvia-riga-vecpilseta'),
    category: withDefault(StringParam, 'apartment'),
    type: withDefault(StringParam, 'sell'),
    priceType: withDefault(StringParam, 'sqm'),
    source: withDefault(StringParam, 'classifieds'),
    outliers: withDefault(BooleanParam, false),
  });
}
