import { put, select, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { SET_SELECTED_NEIGHBORHOOD } from 'store/actionTypes';
import { selectedNeighborhoodSelector } from 'store/selectors';

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
  yield put(push(`/${lat},${lng},13`));
}

function* saga() {
  yield takeEvery(SET_SELECTED_NEIGHBORHOOD, setHighlightedRegion);
}

export default saga;
