import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import map from './map';

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    map,
  });

export default createRootReducer;
