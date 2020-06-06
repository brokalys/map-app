import { area, curveMonotoneX } from 'd3-shape';
import { Defs } from '@nivo/core';
import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { ErrorBoundary } from 'react-error-boundary';
import { Dimmer, Loader, Message, Segment } from 'semantic-ui-react';
import moment from 'moment';
import { ResponsiveLine } from '@nivo/line';

import Bugsnag from 'bugsnag';
import { getPricesInFilteredLocation, getPriceTypeFilter } from 'store';
import styles from './PropertyPriceChart.module.css';

function PropertyPriceChart() {
  const priceType = useRecoilValue(getPriceTypeFilter);
  const { results } = useRecoilValue(getPricesInFilteredLocation);

  const data = useMemo(
    () => [
      {
        id: 'Average Price',
        data: results.map((row) => {
          const prices = priceType === 'sqm' ? row.pricePerSqm : row.price;
          return {
            ...prices,

            x: row.start_datetime.substr(0, 10),
            y: prices.mean,
          };
        }),
      },
    ],
    [results, priceType],
  );

  const maxPrice = data[0].data.reduce(
    (carry, { max }) => (max > carry ? max : carry),
    0,
  );

  function Price({ value }) {
    return (
      <span>
        {Number(value).toLocaleString('en', {
          minimumFractionDigits: 2,
        })}{' '}
        {priceType === 'sqm' ? (
          <span>
            EUR/m<sup>2</sup>
          </span>
        ) : (
          'EUR'
        )}
      </span>
    );
  }

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 10, right: 10, bottom: 100, left: 50 }}
      xScale={{
        type: 'time',
        format: '%Y-%m-%d',
        precision: 'month',
      }}
      xFormat="time:%Y-%m-%d"
      yScale={{
        type: 'linear',
        stacked: false,
        max: maxPrice,
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
                  <strong>Min:</strong> <Price value={point.data.min} />
                </div>
                <div>
                  <strong>{point.serieId}:</strong>{' '}
                  <Price value={point.data.yFormatted} />
                </div>
                <div>
                  <strong>Max:</strong> <Price value={point.data.max} />
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
  return (
    <Segment basic className={styles.container}>
      <ErrorBoundary
        fallback={
          <Message negative>
            Failed loading chart data. Please try again later.
          </Message>
        }
        onError={Bugsnag.notify}
      >
        <React.Suspense
          fallback={
            <Dimmer inverted active>
              <Loader />
            </Dimmer>
          }
        >
          <PropertyPriceChart />
        </React.Suspense>
      </ErrorBoundary>
    </Segment>
  );
}

function AreaLayer({ series, xScale, yScale, innerHeight }) {
  const areaGenerator = area()
    .x((d) => xScale(d.data.x))
    .y0((d) => yScale(d.data.min))
    .y1((d) => yScale(d.data.max))
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
        d={areaGenerator(series[0].data)}
        fill="url(#pattern)"
        fillOpacity={0.2}
        stroke="#3daff7"
        strokeWidth={1}
      />
    </>
  );
}

export default PropertyPriceChartContainer;
