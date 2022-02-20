import { latvia, riga } from '@brokalys/location-json-schemas';
import { createSelector } from 'reselect';

const selectNeighborhood = (state) => state.neighborhood;

const highlightedRegionRigaMap = riga.features.reduce(
  (carry, row) => ({ ...carry, [row.properties.id]: row }),
  {},
);
const highlightedRegionLatviaMap = latvia.features.reduce(
  (carry, row) => ({ ...carry, [row.properties.id]: row }),
  {},
);

function getHighlightedRegionData(id) {
  if (highlightedRegionRigaMap[id]) {
    return highlightedRegionRigaMap[id];
  }

  const data = highlightedRegionLatviaMap[id];
  return {
    ...data,
    geometry: {
      ...data.geometry,
      coordinates: data.geometry.coordinates[0],
    },
  };
}

export const selectedNeighborhoodSelector = createSelector(
  selectNeighborhood,
  (state) => ({
    id: state.selected,
    ...getHighlightedRegionData(state.selected),
    region: getHighlightedRegionData(state.selected).geometry.coordinates,
  }),
);

export const neighborhoodFilterSelector = createSelector(
  selectNeighborhood,
  (state) => ({ source: 'classifieds', ...state.filters }),
);
