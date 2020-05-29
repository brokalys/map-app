import { atom } from 'jared-recoil';

export const filterState = atom({
  key: 'filters',
  default: {
    category: 'apartment',
    type: 'sell',
    location: 'Centrs',
  },
});
