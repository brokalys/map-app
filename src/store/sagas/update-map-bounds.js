import { put, takeLatest } from 'redux-saga/effects';
import { MAP_BOUNDS_CHANGED } from 'store/actionTypes';
import { mapProjectionChanged } from 'store/actions';

function* updateMapBounds({ payload }) {
  yield put(mapProjectionChanged(payload));
}

function* saga() {
  yield takeLatest(MAP_BOUNDS_CHANGED, updateMapBounds);
}

export default saga;
