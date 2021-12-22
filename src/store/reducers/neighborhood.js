import {
  SET_NEIGHBORHOOD_FILTERS,
  SET_SELECTED_NEIGHBORHOOD,
} from '../actionTypes';

const initialState = {
  selected: 'latvia-riga-vecpilseta',
  filters: {
    category: 'apartment',
    type: 'sell',
    price: 'sqm',
    outliers: false,
  },
};

export default function neighborhoodReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_NEIGHBORHOOD: {
      return {
        ...state,
        selected: action.payload,
      };
    }

    case SET_NEIGHBORHOOD_FILTERS: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }

    default:
      return state;
  }
}
