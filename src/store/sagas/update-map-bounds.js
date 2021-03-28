import { debounce, put } from 'redux-saga/effects';
import { MAP_BOUNDS_CHANGED } from 'store/actionTypes';
import { mapProjectionChanged } from 'store/actions';

function* updateMapBounds({ payload }) {
  yield put(mapProjectionChanged(payload));
}

function* saga() {
  yield debounce(1000, MAP_BOUNDS_CHANGED, updateMapBounds);
}

export default saga;
