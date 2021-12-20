import usePriceData from 'hooks/api/use-property-price-chart-data';

function findLastWithValue(data) {
  return data
    .slice()
    .reverse()
    .find(({ price }) => price.mean > 0);
}

export default function useRentalYield() {
  const { data: rentData } = usePriceData({ type: 'rent' });
  const { data: sellData } = usePriceData({ type: 'sell' });

  if (!rentData.length || !sellData.length) {
    return 0;
  }

  const { mean: rentMean } = findLastWithValue(rentData)?.pricePerSqm || {};
  const { mean: sellMean } = findLastWithValue(sellData)?.pricePerSqm || {};

  if (!rentMean || !sellMean) {
    return 0;
  }

  return ((rentMean * 12) / sellMean) * 100;
}
