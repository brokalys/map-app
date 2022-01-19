import { push } from 'connected-react-router';
import queryString from 'query-string';
import { put, select, takeLatest } from 'redux-saga/effects';

import { CLICK_ON_BUILDING } from 'src/store/actionTypes';
import {
  locationPathnameSelector,
  locationQuerySelector,
} from 'src/store/selectors';

function* setActiveBuilding({ payload: buildingId }) {
  const path = yield select(locationPathnameSelector);
  const parts = path.split('/');
  let url = `/${parts[1]}/building/${buildingId}`;

  if (parts[2] === 'building' && parts[3] === String(buildingId)) {
    url = `/${parts[1]}`;
  }

  const query = yield select(locationQuerySelector);
  const qs = queryString.stringify(
    { ...query, page: undefined },
    { skipEmptyString: true },
  );

  yield put(push(`${url}?${qs}`));
}

function* saga() {
  yield takeLatest(CLICK_ON_BUILDING, setActiveBuilding);
}

export default saga;
