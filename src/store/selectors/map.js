import { createSelector } from 'reselect';

const selectMap = (state) => state.map;

function convertBoundsToRegionString(bounds) {
  if (!bounds.ne) return;

  const parts = [
    [bounds.ne.lat, bounds.ne.lng].join(' '),
    [bounds.nw.lat, bounds.nw.lng].join(' '),
    [bounds.sw.lat, bounds.sw.lng].join(' '),
    [bounds.se.lat, bounds.se.lng].join(' '),
    [bounds.ne.lat, bounds.ne.lng].join(' '),
  ];
  return parts.join(', ');
}

export const mapRegionSelector = createSelector(selectMap, (state) =>
  convertBoundsToRegionString(state.bounds),
);
