import { StringParam, useQueryParam, withDefault } from 'use-query-params';

export default function useEstateTypeFilter() {
  return useQueryParam('estateType', withDefault(StringParam, 'building'));
}
