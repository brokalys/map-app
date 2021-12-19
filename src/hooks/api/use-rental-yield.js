import usePriceData from 'hooks/api/use-property-price-chart-data';

export default function useRentalYield() {
  const { data: rentData } = usePriceData({ type: 'rent' });
  const { data: sellData } = usePriceData({ type: 'sell' });

  if (!rentData.length || !sellData.length) {
    return 0;
  }

  const { mean: rentMean } = rentData[rentData.length - 1].pricePerSqm;
  const { mean: sellMean } = sellData[sellData.length - 1].pricePerSqm;

  if (!rentMean || !sellMean) {
    return 0;
  }

  return ((rentMean * 12) / sellMean) * 100;
}
