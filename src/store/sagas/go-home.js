import { push } from 'connected-react-router';
import { put, select, takeLatest } from 'redux-saga/effects';

import { RETURN_TO_HOME_CLICKED } from 'src/store/actionTypes';
import { locationPathnameSelector } from 'src/store/selectors';

function* goHome() {
  const path = yield select(locationPathnameSelector);
  const parts = path.split('/');

  yield put(push(`/${parts[1]}`));
}

function* saga() {
  yield takeLatest(RETURN_TO_HOME_CLICKED, goHome);
}

export default saga;
