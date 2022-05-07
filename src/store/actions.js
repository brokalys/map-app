import { MAP_PROJECTION_CHANGED } from './actionTypes';

export const mapProjectionChanged = (payload) => ({
  type: MAP_PROJECTION_CHANGED,
  payload,
});
