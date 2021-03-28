import { riga } from '@brokalys/location-json-schemas';
import { createSelector } from 'reselect';

const selectNeighborhood = (state) => state.neighborhood;

const highlightedRegionMap = riga.features.reduce(
  (carry, row) => ({ ...carry, [row.properties.id]: row.geometry.coordinates }),
  {},
);

export const selectedNeighborhoodSelector = createSelector(
  selectNeighborhood,
  (state) => ({
    id: state.selected,
    region: highlightedRegionMap[state.selected],
  }),
);

export const neighborhoodFilterSelector = createSelector(
  selectNeighborhood,
  (state) => state.filters,
);
