import { put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { CLICK_ON_BUILDING } from 'store/actionTypes';
import { locationPathnameSelector } from 'store/selectors';

function* setActiveBuilding({ payload: buildingId }) {
  const path = yield select(locationPathnameSelector);
  const parts = path.split('/');
  let url = `/${parts[1]}/building/${buildingId}`;

  if (parts[2] === 'building' && parts[3] === String(buildingId)) {
    url = `/${parts[1]}`;
  }

  yield put(push(url));
}

function* saga() {
  yield takeLatest(CLICK_ON_BUILDING, setActiveBuilding);
}

export default saga;
