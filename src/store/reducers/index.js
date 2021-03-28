import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import map from './map';
import neighborhood from './neighborhood';

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    map,
    neighborhood,
  });

export default createRootReducer;
