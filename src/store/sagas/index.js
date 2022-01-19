import { all } from 'redux-saga/effects';

import goHome from './go-home';
import mapCenterOnNeighborhood from './map-center-on-neighborhood';
import setActiveBuilding from './set-active-building';
import setMapCenter from './set-map-center';
import updateMapBounds from './update-map-bounds';

export default function* rootSaga() {
  yield all([
    goHome(),
    mapCenterOnNeighborhood(),
    setActiveBuilding(),
    setMapCenter(),
    updateMapBounds(),
  ]);
}
