import {
  CLICK_ON_BUILDING,
  MAP_BOUNDS_CHANGED,
  MAP_PROJECTION_CHANGED,
  SET_NEIGHBORHOOD_FILTERS,
  SET_SELECTED_NEIGHBORHOOD,
  RETURN_TO_HOME_CLICKED,
} from './actionTypes';

export const clickOnBuilding = (payload) => ({
  type: CLICK_ON_BUILDING,
  payload,
});

export const returnToHomeClicked = () => ({
  type: RETURN_TO_HOME_CLICKED,
});

export const mapBoundsChanged = (payload) => ({
  type: MAP_BOUNDS_CHANGED,
  payload,
});

export const mapProjectionChanged = (payload) => ({
  type: MAP_PROJECTION_CHANGED,
  payload,
});

export const setNeighborhoodFilters = (payload) => ({
  type: SET_NEIGHBORHOOD_FILTERS,
  payload,
});

export const setSelectedNeighborhood = (payload) => ({
  type: SET_SELECTED_NEIGHBORHOOD,
  payload,
});
