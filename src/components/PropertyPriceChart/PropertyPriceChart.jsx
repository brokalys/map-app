import { Defs } from '@nivo/core';
import { ResponsiveLine } from '@nivo/line';
import { area, curveMonotoneX } from 'd3-shape';
import moment from 'moment';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Dimmer, Loader, Message, Segment } from 'semantic-ui-react';

import usePriceData from 'src/hooks/api/use-property-price-chart-data';
import { neighborhoodFilterSelector } from 'src/store/selectors';

import styles from './PropertyPriceChart.module.css';

function removeOutliers(data) {
  const maxPoints = data.map(({ max }) => max);
  const sum = maxPoints.reduce((carry, num) => carry + num, 0);
  const average = sum / maxPoints.length - 1;

  const fixedData = data.filter(({ max }) => average * 2 > max);

  if (data.length > fixedData.length) {
    return removeOutliers(fixedData);
  }

  return fixedData;
}

function useChartData(results, { priceType, showOutliers }) {
  const data = useMemo(
    () =>
      results.map((row) => {
        const prices = priceType === 'sqm' ? row.pricePerSqm : row.price;
        return {
          ...prices,

          x: row.start_datetime.substr(0, 10),
          y: prices.mean,
        };
      }),
    [results, priceType],
  );

  const cleanedData = useMemo(
    () => (showOutliers ? data : removeOutliers(data)),
    [data, showOutliers],
  );

  return cleanedData.length > 9 ? cleanedData : data;
}

function PropertyPriceChart(props) {
  const { price: priceType, outliers: showOutliers } = useSelector(
    neighborhoodFilterSelector,
  );

  const data = useChartData(props.results, { priceType, showOutliers });

  const maxPrice = data.reduce(
    (carry, { max }) => (max > carry ? max : carry),
    0,
  );

  function Price(props) {
    return (
      <span>
        {Number(props.value).toLocaleString('en', {
          minimumFractionDigits: 2,
        })}{' '}
        {priceType === 'sqm' ? (
          <span>
            €/m<sup>2</sup>
          </span>
        ) : (
          '€'
        )}
      </span>
    );
  }

  return (
    <ResponsiveLine
      data={[
        {
          id: 'Average Price',
          data,
        },
      ]}
      margin={{ top: 10, right: 5, bottom: 100, left: 60 }}
      xScale={{
        type: 'time',
        format: '%Y-%m-%d',
        precision: 'month',
      }}
      xFormat="time:%Y-%m-%d"
      yScale={{
        type: 'linear',
        stacked: false,
        max: maxPrice * 1.05,
      }}
      sliceTooltip={({ slice }) => {
        return (
          <div className={styles.tooltip}>
            {slice.points.map((point) => (
              <div key={point.id}>
                <div>
                  <strong>{moment(point.data.x).format('YYYY-MM-DD')}</strong>
                </div>
                <div>
                  <strong>Max:</strong> <Price value={point.data.max} />
                </div>
                <div>
                  <strong>{point.serieId}:</strong>{' '}
                  <Price value={point.data.yFormatted} />
                </div>
                <div>
                  <strong>Min:</strong> <Price value={point.data.min} />
                </div>
                <hr />
                <div>
                  <strong>Mode:</strong> <Price value={point.data.mode} />
                </div>
                <div>
                  <strong>Median:</strong> <Price value={point.data.median} />
                </div>
              </div>
            ))}
          </div>
        );
      }}
      axisBottom={{
        format: '%Y-%m',
        tickValues: 'every 2 months',
        tickRotation: -90,
      }}
      axisLeft={{
        format: (value) => `${value} €`,
      }}
      enablePoints={true}
      curve="monotoneX"
      useMesh={true}
      enableSlices="x"
      layers={[
        'grid',
        'markers',
        'axes',
        'areas',
        'crosshair',
        AreaLayer,
        'lines',
        'points',
        'slices',
        'mesh',
        'legends',
      ]}
    />
  );
}

function PropertyPriceChartContainer() {
  const { data, loading, error } = usePriceData();

  if (loading) {
    return (
      <Dimmer inverted active>
        <Loader />
      </Dimmer>
    );
  }

  if (error) {
    return (
      <Message negative>
        Failed loading chart data. Please try again later.
      </Message>
    );
  }

  return <PropertyPriceChart results={data} />;
}

function AreaLayer(props) {
  const areaGenerator = area()
    .x((d) => props.xScale(d.data.x || 0))
    .y0((d) => props.yScale(d.data.min || 0))
    .y1((d) => props.yScale(d.data.max || 0))
    .curve(curveMonotoneX);

  return (
    <>
      <Defs
        defs={[
          {
            id: 'pattern',
            type: 'patternLines',
            background: 'transparent',
            color: '#3daff7',
            lineWidth: 1,
            spacing: 6,
            rotation: -45,
          },
        ]}
      />
      <path
        d={areaGenerator(props.series[0].data)}
        fill="url(#pattern)"
        fillOpacity={0.2}
        stroke="#3daff7"
        strokeWidth={0.4}
      />
    </>
  );
}

export default function PropertyPriceChartWrapper() {
  return (
    <Segment basic className={styles.container}>
      <PropertyPriceChartContainer />
    </Segment>
  );
}
