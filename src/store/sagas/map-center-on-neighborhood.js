import { replace } from 'connected-react-router';
import { put, select, takeEvery } from 'redux-saga/effects';

import { SET_SELECTED_NEIGHBORHOOD } from 'src/store/actionTypes';
import { selectedNeighborhoodSelector } from 'src/store/selectors';

function getCenterCoords(arr) {
  const coords = arr.reduce(
    (x, y) => [x[0] + y[0] / arr.length, x[1] + y[1] / arr.length],
    [0, 0],
  );

  return { lat: coords[1], lng: coords[0] };
}

function* setHighlightedRegion(action) {
  const { region } = yield select(selectedNeighborhoodSelector);
  const { lat, lng } = getCenterCoords(region[0]);
  yield put(replace(`/${lat},${lng},13`));
}

function* saga() {
  yield takeEvery(SET_SELECTED_NEIGHBORHOOD, setHighlightedRegion);
}

export default saga;
