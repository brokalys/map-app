import { useSelector } from 'react-redux';
import usePriceData from 'hooks/api/use-property-price-chart-data';
import { neighborhoodFilterSelector } from 'store/selectors';

export default function useRentalYield() {
  const { price: priceType } = useSelector(neighborhoodFilterSelector);
  const { results: rentData } = usePriceData({ type: 'rent' });
  const { results: sellData } = usePriceData({ type: 'sell' });

  if (!rentData.length || !sellData.length) {
    return 0;
  }

  const group = priceType === 'sqm' ? 'pricePerSqm' : 'price';

  const { mean: rentMean } = rentData[rentData.length - 1][group];
  const { mean: sellMean } = sellData[sellData.length - 1][group];

  if (!rentMean || !sellMean) {
    return 0;
  }

  return (rentMean / sellMean) * 100;
}
