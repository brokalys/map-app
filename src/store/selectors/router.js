import { createSelector } from 'reselect';

const selectRouter = (state) => state.router;

export const locationSelector = createSelector(
  selectRouter,
  (state) => state.location,
);

export const locationPathnameSelector = createSelector(
  locationSelector,
  (location) => location.pathname,
);

export const locationQuerySelector = createSelector(
  locationSelector,
  (location) => location.query,
);

export const querystringParamSelector = (segment) =>
  createSelector(locationQuerySelector, (query) => query[segment]);
