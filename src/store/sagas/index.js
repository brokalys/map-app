import { all } from 'redux-saga/effects';

import goHome from './go-home';
import locateBuilding from './locate-building';
import setActiveBuilding from './set-active-building';
import setMapCenter from './set-map-center';
import updateMapBounds from './update-map-bounds';

export default function* rootSaga() {
  yield all([
    goHome(),
    setActiveBuilding(),
    setMapCenter(),
    updateMapBounds(),
    locateBuilding(),
  ]);
}
