import { all } from 'redux-saga/effects';

import setMapCenter from './set-map-center';
import updateMapBounds from './update-map-bounds';

export default function* rootSaga() {
  yield all([setMapCenter(), updateMapBounds()]);
}
