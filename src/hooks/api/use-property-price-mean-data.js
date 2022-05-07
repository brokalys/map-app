import usePriceData from 'src/hooks/api/use-property-price-chart-data';
import useChartFilters from 'src/hooks/use-price-chart-filters';

function findLastWithValue(data) {
  return data
    .slice()
    .reverse()
    .find(({ price }) => price.mean > 0);
}

export default function usePriceMeanData() {
  const [{ priceType }] = useChartFilters();
  const { data: results, loading } = usePriceData();

  // Still loading..
  if (loading) {
    return {
      change: {},
    };
  }

  const group = priceType === 'sqm' ? 'pricePerSqm' : 'price';
  const lastValue = findLastWithValue(results);

  if (!lastValue) {
    return {
      change: {},
    };
  }

  const {
    [group]: { mean },
  } = lastValue;

  return {
    price: mean,
    change: {
      mom: (1 - mean / results[results.length - 2][group].mean) * 100,
      yoy: (1 - mean / results[results.length - 13][group].mean) * 100,
    },
  };
}
