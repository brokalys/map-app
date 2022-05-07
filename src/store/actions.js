import { MAP_BOUNDS_CHANGED, MAP_PROJECTION_CHANGED } from './actionTypes';

export const mapBoundsChanged = (payload) => ({
  type: MAP_BOUNDS_CHANGED,
  payload,
});

export const mapProjectionChanged = (payload) => ({
  type: MAP_PROJECTION_CHANGED,
  payload,
});
