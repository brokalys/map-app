import { useSelector } from 'react-redux';
import usePriceData from 'hooks/api/use-property-price-chart-data';
import { neighborhoodFilterSelector } from 'store/selectors';

export default function usePriceMeanData() {
  const { price: priceType } = useSelector(neighborhoodFilterSelector);
  const { loadingResults, results } = usePriceData();

  // Still loading..
  if (loadingResults > 0) {
    return {
      change: {},
    };
  }

  const group = priceType === 'sqm' ? 'pricePerSqm' : 'price';

  const {
    [group]: { mean },
  } = results[results.length - 1];

  return {
    price: mean,
    change: {
      mom: (1 - mean / results[results.length - 2][group].mean) * 100,
      yoy: (1 - mean / results[results.length - 13][group].mean) * 100,
    },
  };
}
