import {
  CLICK_ON_BUILDING,
  CLICK_ON_SUGGESTED_ADDRESS,
  MAP_BOUNDS_CHANGED,
  MAP_PROJECTION_CHANGED,
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

export const clickOnSuggestedAddress = (payload) => ({
  type: CLICK_ON_SUGGESTED_ADDRESS,
  payload,
});
