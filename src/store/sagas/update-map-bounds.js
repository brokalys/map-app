import { put, takeLatest } from 'redux-saga/effects';

import { MAP_BOUNDS_CHANGED } from 'src/store/actionTypes';
import { mapProjectionChanged } from 'src/store/actions';

function* updateMapBounds({ payload }) {
  yield put(mapProjectionChanged(payload));
}

function* saga() {
  yield takeLatest(MAP_BOUNDS_CHANGED, updateMapBounds);
}

export default saga;
