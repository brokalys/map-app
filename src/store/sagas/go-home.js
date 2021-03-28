import { put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { RETURN_TO_HOME_CLICKED } from 'store/actionTypes';
import { locationPathnameSelector } from 'store/selectors';

function* goHome() {
  const path = yield select(locationPathnameSelector);
  const parts = path.split('/');

  yield put(push(`/${parts[1]}`));
}

function* saga() {
  yield takeLatest(RETURN_TO_HOME_CLICKED, goHome);
}

export default saga;
