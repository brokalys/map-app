import axios from 'axios';
import { selector, selectorFamily } from 'recoil';

import { filterState } from './state';

export const getCategoryFilter = selector({
  key: 'filters.category',
  get: ({ get }) => get(filterState).category,
  set: ({ get, set }, newValue) =>
    set(filterState, {
      ...get(filterState),
      category: newValue,
    }),
});
export const getTypeFilter = selector({
  key: 'filters.type',
  get: ({ get }) => get(filterState).type,
  set: ({ get, set }, newValue) =>
    set(filterState, {
      ...get(filterState),
      type: newValue,
    }),
});
export const getLocationFilter = selector({
  key: 'filters.location',
  get: ({ get }) => get(filterState).location,
  set: ({ get, set }, newValue) =>
    set(filterState, {
      ...get(filterState),
      location: newValue,
    }),
});
export const getPriceTypeFilter = selector({
  key: 'filters.priceType',
  get: ({ get }) => get(filterState).priceType,
  set: ({ get, set }, newValue) =>
    set(filterState, {
      ...get(filterState),
      priceType: newValue,
    }),
});

export const getPrices = selectorFamily({
  key: 'getPrices',
  get: (filters) => async ({ get }) => {
    const filterStr = encodeURIComponent(JSON.stringify(filters));

    async function loadData() {
      const { data } = await axios.get(
        `https://static-api.brokalys.com/stats/monthly?discard=0.1&filters=${filterStr}`,
      );
      return data;
    }

    let runs = 0;

    return new Promise(async function reloadPromise(resolve) {
      const data = await loadData();

      if (data.loadingResults === 0 || runs++ >= 3) {
        return resolve(data);
      }

      setTimeout(
        () => reloadPromise(resolve),
        data.loadingResults <= 2 ? 1000 : 3000,
      );
    });
  },
});

export const getPricesInFilteredLocation = selector({
  key: 'priceInFilteredLocation',
  get: async ({ get }) => {
    const location = get(getLocationFilter);
    const type = get(getTypeFilter);
    const category = get(getCategoryFilter);
    return await get(
      getPrices({ category, type, location_classificator: location }),
    );
  },
});

export const getMeanPriceLastMonth = selector({
  key: 'meanPriceLastMonth',
  get: async ({ get }) => {
    const location = get(getLocationFilter);
    const type = get(getTypeFilter);
    const category = get(getCategoryFilter);
    const priceType = get(getPriceTypeFilter);
    const { results: data } = await get(
      getPrices({ category, type, location_classificator: location }),
    );

    const group = priceType === 'sqm' ? 'pricePerSqm' : 'price';

    const {
      [group]: { mean },
    } = data[data.length - 1];

    return {
      price: mean,
      change: {
        mom: (1 - mean / data[data.length - 2][group].mean) * 100,
        yoy: (1 - mean / data[data.length - 13][group].mean) * 100,
      },
    };
  },
});

export const getRentalYield = selector({
  key: 'rentalYield',
  get: async ({ get }) => {
    const category = get(getCategoryFilter);
    const location = get(getLocationFilter);
    const priceType = get(getPriceTypeFilter);

    const [{ results: sellData }, { results: rentData }] = await Promise.all([
      get(
        getPrices({ category, type: 'sell', location_classificator: location }),
      ),
      get(
        getPrices({ category, type: 'rent', location_classificator: location }),
      ),
    ]);

    const group = priceType === 'sqm' ? 'pricePerSqm' : 'price';

    return (
      (rentData[rentData.length - 1][group].mean /
        sellData[sellData.length - 1][group].mean) *
      100
    );
  },
});
