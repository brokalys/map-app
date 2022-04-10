import { Defs } from '@nivo/core';
import { ResponsiveLine } from '@nivo/line';
import { Crosshair } from '@nivo/tooltip';
import { area, curveMonotoneX } from 'd3-shape';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Dimmer, Loader, Message, Segment } from 'semantic-ui-react';

import usePriceData from 'src/hooks/api/use-property-price-chart-data';
import { setNeighborhoodFilters } from 'src/store/actions';
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

function useChartData(results, { priceType, showOutliers, source }) {
  const data = useMemo(
    () =>
      results.map((row) => {
        const prices = priceType === 'sqm' ? row.pricePerSqm : row.price;
        return {
          ...prices,
          count: row.count,
          x: row.start_datetime.substr(0, 10),
          y: prices.mean,
        };
      }),
    [results, priceType],
  );

  const cleanedData = useMemo(() => removeOutliers(data), [data]);

  return {
    data: !showOutliers && cleanedData.length > 9 ? cleanedData : data,
    hasOutliers: cleanedData.length !== data.length,
  };
}

function PropertyPriceChart(props) {
  const dispatch = useDispatch();
  const {
    price: priceType,
    outliers: showOutliers,
    source,
  } = useSelector(neighborhoodFilterSelector);

  const { data, hasOutliers } = useChartData(props.results, {
    priceType,
    showOutliers,
    source,
  });
  const countData = useMemo(
    () =>
      data.map((row) => ({
        ...row,
        y: row.count,
      })),
    [data],
  );
  const isSourceClassifieds = source === 'classifieds';

  const maxPrice = data.reduce(
    (carry, { max }) => (max > carry ? max : carry),
    0,
  );

  const [crosshairAPosition, setCrosshairAPosition] = useState(null);
  const [crosshairBPosition, setCrosshairBPosition] = useState(null);

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
    <div className={styles.chartWrapper}>
      <div className={styles.priceChartWrapper}>
        <ResponsiveLine
          data={[
            {
              id: 'Average Price',
              data,
            },
          ]}
          margin={{ top: 10, right: 5, bottom: 10, left: 60 }}
          yScale={{
            type: 'linear',
            stacked: false,
            max: maxPrice * 1.05,
          }}
          enableSlices="x"
          sliceTooltip={({ slice }) => {
            return (
              <div className={styles.tooltip}>
                {slice.points.map((point) => (
                  <div key={point.id}>
                    {!isSourceClassifieds && (
                      <Message warning size="mini">
                        <strong>Data might not be fully accurate.</strong>
                        Brokalys exposes all the available data, however it
                        takes time for all real-sales to be released by VZD.
                        Therefore the last quarters might have incomplete
                        data-set.
                      </Message>
                    )}
                    <div>
                      <strong>
                        {moment(point.data.x).format(
                          isSourceClassifieds ? 'YYYY-MM-DD' : 'YYYY [Q]Q',
                        )}
                      </strong>
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
                      <strong>Median:</strong>{' '}
                      <Price value={point.data.median} />
                    </div>
                    <hr />
                    <div>
                      <strong>Data points:</strong> {point.data.count}
                    </div>
                  </div>
                ))}
              </div>
            );
          }}
          axisBottom={false}
          axisLeft={{
            format: (value) => `${value} €`,
          }}
          curve="monotoneX"
          useMesh
          layers={[
            'grid',
            'markers',
            'axes',
            'areas',
            isSourceClassifieds || WarningLayer,
            AreaLayer,
            (props) => (
              <CustomCrosshair
                {...props}
                currentSlice={crosshairBPosition || props.currentSlice}
              />
            ),
            'lines',
            'points',
            'slices',
            'mesh',
            'legends',
            (props) => setCrosshairAPosition(props.currentSlice),
          ]}
        />
      </div>

      <div className={styles.countChartWrapper}>
        <ResponsiveLine
          data={[
            {
              id: 'Data point count',
              data: countData,
            },
          ]}
          margin={{ right: 5, top: 5, bottom: 70, left: 60 }}
          padding={0}
          axisLeft={{
            tickValues: 2,
          }}
          gridYValues={4}
          axisBottom={{
            format: (x) => {
              return moment(x).format(
                isSourceClassifieds ? 'YYYY-MM-DD' : 'YYYY [Q]Q',
              );
            },
            tickRotation: -90,
          }}
          enableSlices="x"
          sliceTooltip={({ slice }) => {
            return (
              <div className={styles.tooltip}>
                {slice.points.map((point) => (
                  <div key={point.id}>
                    <div>
                      <strong>
                        {moment(point.data.x).format(
                          isSourceClassifieds ? 'YYYY-MM-DD' : 'YYYY [Q]Q',
                        )}
                      </strong>
                    </div>
                    <div>
                      <strong>Data points:</strong> {point.data.count}
                    </div>
                  </div>
                ))}
              </div>
            );
          }}
          useMesh
          layers={[
            'grid',
            'markers',
            'axes',
            'areas',
            isSourceClassifieds || WarningLayer,
            (props) => (
              <CustomCrosshair
                {...props}
                currentSlice={crosshairAPosition || props.currentSlice}
              />
            ),
            'lines',
            'points',
            'slices',
            'mesh',
            'legends',
            (props) => setCrosshairBPosition(props.currentSlice),
          ]}
        />

        {hasOutliers && (
          <Checkbox
            className={styles.outlierCheckbox}
            label="show outliers"
            checked={showOutliers}
            onChange={(event, data) =>
              dispatch(setNeighborhoodFilters({ outliers: data.checked }))
            }
          />
        )}
      </div>
    </div>
  );
}

function PropertyPriceChartContainer() {
  const { data, loading, error } = usePriceData();

  if (loading) {
    return (
      <Dimmer inverted active>
        <Loader>
          Loading price data..
          <hr />
          Depending on the size of the region, this might take a few minutes.
          Please be patient.
        </Loader>
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

function WarningLayer(props) {
  const areaGenerator = area()
    .x(({ position }) => {
      const point = props.points.at(-3);
      return position.x > point.x ? position.x : point.x;
    })
    .y0((d) => 0)
    .y1((d) => props.innerHeight);

  return (
    <path
      d={areaGenerator(props.series[0].data)}
      fill="#f9cd31"
      fillOpacity={0.3}
    />
  );
}

function CustomCrosshair(props) {
  if (!props.currentSlice) {
    return null;
  }

  return (
    <Crosshair
      width={props.innerWidth}
      height={props.innerHeight}
      x={props.currentSlice.x}
      y={props.currentSlice.y}
      type="x"
    />
  );
}

export default function PropertyPriceChartWrapper() {
  return (
    <Segment basic className={styles.container}>
      <PropertyPriceChartContainer />
    </Segment>
  );
}
