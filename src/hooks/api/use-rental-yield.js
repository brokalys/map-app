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

  return (
    (rentData[rentData.length - 1][group].mean /
      sellData[sellData.length - 1][group].mean) *
    100
  );
}
