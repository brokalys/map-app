import { Defs } from '@nivo/core';
import { ResponsiveLine } from '@nivo/line';
import type { ComputedDatum, CustomLayer, Datum } from '@nivo/line';
import { Crosshair } from '@nivo/tooltip';
import { area, curveMonotoneX } from 'd3-shape';
import moment from 'moment';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Checkbox,
  Dimmer,
  Loader,
  Message,
  Progress,
  Segment,
} from 'semantic-ui-react';

import type { PriceResult } from 'src/hooks/api/use-property-price-chart-data';
import usePriceData from 'src/hooks/api/use-property-price-chart-data';
import useChartFilters from 'src/hooks/use-price-chart-filters';
import useProgress from 'src/hooks/use-progress';

import styles from './PropertyPriceChart.module.css';

const CrosshairContext = React.createContext<
  [undefined | { x: number; y: number }, Function]
>([undefined, () => {}]);

function removeOutliers<T extends { max: number }>(data: T[]): T[] {
  const maxPoints = data.map(({ max }) => max);
  const sum = maxPoints.reduce((carry, num) => carry + num, 0);
  const average = sum / maxPoints.length - 1;

  const fixedData = data.filter(({ max }) => average * 2 > max);

  if (data.length > fixedData.length) {
    return removeOutliers(fixedData);
  }

  return fixedData;
}

function useChartData(
  results: PriceResult[],
  {
    priceType,
    showOutliers,
    source,
  }: { priceType: string; showOutliers: boolean; source: string },
) {
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

interface PropertyPriceChartProps {
  results: PriceResult[];
}

const PropertyPriceChart: React.FC<PropertyPriceChartProps> = (props) => {
  const [{ priceType, outliers: showOutliers, source }, setQuery] =
    useChartFilters();

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

  const crosshairPosition = useState<undefined | { x: number; y: number }>();

  function Price(props: { value: string }) {
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
    <CrosshairContext.Provider value={crosshairPosition}>
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
                  {slice.points.map((point: any) => (
                    <div key={point.id}>
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
                      {!isSourceClassifieds &&
                        point.index >=
                          data.filter((row) => row.y > 0).length - 3 && (
                          <Message warning size="mini">
                            <strong>Data might not be fully accurate.</strong>
                            Brokalys exposes all the available data, however it
                            takes time for all real-sales to be released by VZD.
                            Therefore the last quarters might have incomplete
                            data-set.
                          </Message>
                        )}
                    </div>
                  ))}
                </div>
              );
            }}
            animate={false}
            axisBottom={null}
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
              isSourceClassifieds ? NoopLayer : WarningLayer,
              AreaLayer,
              CustomCrosshair,
              'lines',
              'points',
              'slices',
              'mesh',
              'legends',
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
            axisLeft={{
              tickValues: 2,
            }}
            gridYValues={4}
            animate={false}
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
                  {slice.points.map((point: any) => (
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
              isSourceClassifieds ? NoopLayer : WarningLayer,
              CustomCrosshair,
              'lines',
              'points',
              'slices',
              'mesh',
              'legends',
            ]}
          />

          {hasOutliers && (
            <Checkbox
              className={styles.outlierCheckbox}
              label="show outliers"
              checked={showOutliers}
              onChange={(event, data) => {
                setQuery({ outliers: data.checked });
              }}
            />
          )}
        </div>
      </div>
    </CrosshairContext.Provider>
  );
};

function PropertyPriceChartContainer() {
  const { data, loading, loadingState, error } = usePriceData();
  const progressValue = useProgress(
    loadingState.totalResults * 0.9,
    loadingState.totalResults - loadingState.loadingResults,
  );

  if (loading) {
    return (
      <Dimmer inverted active>
        <Loader>
          Loading price data..
          <hr />
          <p>
            Depending on the size of the region, this might take a few minutes.
            Please be patient.
          </p>
          <Progress
            value={progressValue}
            total={loadingState.totalResults}
            indicating
          />
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

const AreaLayer: CustomLayer = (props) => {
  const areaGenerator = area<ComputedDatum>()
    .x((d) => (props.xScale as any)(d.data.x || 0))
    .y0((d) => (props.yScale as any)(d.data.min || 0))
    .y1((d) => (props.yScale as any)(d.data.max || 0))
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
        d={areaGenerator(props.series[0].data)!}
        fill="url(#pattern)"
        fillOpacity={0.2}
        stroke="#3daff7"
        strokeWidth={0.4}
      />
    </>
  );
};

const warningAreaGenerator = (innerHeight: number, points: ComputedDatum[]) =>
  area<ComputedDatum>()
    .x(({ position }) => {
      const point = points.at(-3)!.position;
      return position.x > point.x ? position.x : point.x;
    })
    .y1(() => innerHeight)(points)!;

const WarningLayer: CustomLayer = (props) => {
  const points = props.series[0].data;
  const path = warningAreaGenerator(props.innerHeight, points);

  return <path d={path} fill="#f9cd31" fillOpacity={0.3} />;
};

const CustomCrosshair: CustomLayer = (props) => {
  const [crosshairPosition, setCrosshairPosition] =
    useContext(CrosshairContext);

  const { currentSlice } = props as unknown as { currentSlice: Datum };

  useEffect(() => {
    const position = currentSlice
      ? { x: currentSlice.x, y: currentSlice.y }
      : undefined;
    setCrosshairPosition(position);
  }, [setCrosshairPosition, currentSlice]);

  if (!crosshairPosition) {
    return null;
  }

  return (
    <Crosshair
      width={props.innerWidth}
      height={props.innerHeight}
      x={crosshairPosition.x}
      y={crosshairPosition.y}
      type="x"
    />
  );
};

const NoopLayer: CustomLayer = () => null;

export default function PropertyPriceChartWrapper() {
  return (
    <>
      {/* @ts-expect-error */}
      <Segment basic className={styles.container}>
        <PropertyPriceChartContainer />
      </Segment>
    </>
  );
}
