import { push } from 'connected-react-router';
import { put, select, takeLatest } from 'redux-saga/effects';

import { CLICK_ON_SUGGESTED_ADDRESS } from 'src/store/actionTypes';
import { locationSearchSelector } from 'src/store/selectors';

const DEFAULT_ZOOM = 16;

function* locateBuilding({ payload }) {
  const search = yield select(locationSearchSelector);

  const lat = String(payload.lat).substr(0, 7);
  const lng = String(payload.lng).substr(0, 7);
  const zoom = payload.zoom || DEFAULT_ZOOM;

  const path = `/${lat},${lng},${zoom}/locate-building`;

  yield put(push(path + search));
}

function* saga() {
  yield takeLatest(CLICK_ON_SUGGESTED_ADDRESS, locateBuilding);
}

export default saga;
