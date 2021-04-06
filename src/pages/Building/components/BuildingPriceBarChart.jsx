import { ResponsiveBar } from '@nivo/bar';
import PropType from 'prop-types';
import Skeleton from 'react-loading-skeleton';

export default function BuildingPriceBarChart(props) {
  if (props.error) {
    return null;
  }

  if (props.loading) {
    return <Skeleton height="100%" width="100%" />;
  }

  const data = [
    { group: 'Current building', value: props.priceCurrentBuilding || 0 },
    { group: 'Active region', value: props.priceActiveRegion },
  ];

  return (
    <ResponsiveBar
      data={data}
      margin={{ top: 10, right: 40, bottom: 30, left: 70 }}
      indexBy="group"
      padding={0.5}
      keys={['value']}
      isInteractive={false}
      motionStiffness={300}
      motionDamping={40}
      axisLeft={{
        format: props.labelFormat,
      }}
      labelFormat={props.labelFormat}
    />
  );
}

BuildingPriceBarChart.propTypes = {
  error: PropType.object,
  loading: PropType.bool.isRequired,
  priceCurrentBuilding: PropType.number.isRequired,
  priceActiveRegion: PropType.number.isRequired,
  labelFormat: PropType.func.isRequired,
};
