import { put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { MAP_BOUNDS_CHANGED } from 'store/actionTypes';
import { locationPathnameSelector } from 'store/selectors';

function* setMapCenter({ payload: map }) {
  const zoom = map.getZoom();
  const currentPath = yield select(locationPathnameSelector);
  const parts = currentPath.split('/');

  let newPath = `/${map.center.lat()},${map.center.lng()},${zoom}`;
  if (parts[2] === 'building' && zoom > 14) {
    newPath += `/building/${parts[3]}`;
  }

  if (newPath === currentPath) return;

  yield put(push(newPath));
}

function* saga() {
  yield takeLatest(MAP_BOUNDS_CHANGED, setMapCenter);
}

export default saga;
