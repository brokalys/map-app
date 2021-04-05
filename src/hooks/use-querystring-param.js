import { replace } from 'connected-react-router';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import {
  querystringParamSelector,
  locationQuerySelector,
} from 'store/selectors';

export default function useQuerystringParam(
  key,
  extraQuerystringOverwrite = {},
) {
  const dispatch = useDispatch();
  const value = useSelector(querystringParamSelector(key));
  const query = useSelector(locationQuerySelector);

  function updateFilterValue(newValue) {
    dispatch(
      replace(
        `?${queryString.stringify(
          { ...query, ...extraQuerystringOverwrite, [key]: newValue },
          { skipEmptyString: true },
        )}`,
      ),
    );
  }

  return [value, updateFilterValue];
}
