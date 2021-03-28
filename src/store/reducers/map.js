import { MAP_PROJECTION_CHANGED } from '../actionTypes';

const initialState = {
  bounds: {},
};

export default function mapReducer(state = initialState, action) {
  switch (action.type) {
    case MAP_PROJECTION_CHANGED: {
      const { payload: map } = action;
      const bounds = {
        nw: {
          lat: map.getBounds().getSouthWest().lat(),
          lng: map.getBounds().getNorthEast().lng(),
        },
        ne: {
          lat: map.getBounds().getNorthEast().lat(),
          lng: map.getBounds().getNorthEast().lng(),
        },

        sw: {
          lat: map.getBounds().getSouthWest().lat(),
          lng: map.getBounds().getSouthWest().lng(),
        },
        se: {
          lat: map.getBounds().getNorthEast().lat(),
          lng: map.getBounds().getSouthWest().lng(),
        },
      };

      return {
        ...state,
        bounds,
      };
    }

    default:
      return state;
  }
}
