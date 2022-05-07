import { createSelector } from 'reselect';

const selectRouter = (state) => state.router;

const locationSelector = createSelector(
  selectRouter,
  (state) => state.location,
);

export const locationPathnameSelector = createSelector(
  locationSelector,
  (location) => location.pathname,
);

export const locationSearchSelector = createSelector(
  locationSelector,
  (location) => location.search,
);

export const locationQuerySelector = createSelector(
  locationSelector,
  (location) => location.query,
);
