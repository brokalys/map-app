import { replace } from 'connected-react-router';
import { put, select, takeLatest } from 'redux-saga/effects';

import { MAP_BOUNDS_CHANGED } from 'src/store/actionTypes';
import {
  locationPathnameSelector,
  locationSearchSelector,
} from 'src/store/selectors';

function* setMapCenter({ payload: map }) {
  const zoom = map.getZoom();
  const currentPath = yield select(locationPathnameSelector);
  const search = yield select(locationSearchSelector);
  const parts = currentPath.split('/');

  let newPath = `/${map.center.lat()},${map.center.lng()},${zoom}`;
  if (parts[2] === 'building' && zoom > 14) {
    newPath += `/building/${parts[3]}`;
  }

  if (newPath === currentPath) return;

  yield put(replace(newPath + search));
}

function* saga() {
  yield takeLatest(MAP_BOUNDS_CHANGED, setMapCenter);
}

export default saga;
