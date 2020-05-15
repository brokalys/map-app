import React, { useContext, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDebouncedCallback } from 'use-debounce';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { useQuery, gql } from '@apollo/client';
import { ResponsiveLine } from '@nivo/line';

import MapContext from 'context/MapContext';
import styles from './PropertyPriceLine.module.css';

const moment = extendMoment(Moment);
const range = moment().range('2019-01-01', new Date());
const dates = Array.from(range.by('month', { excludeEnd: true })).map((m) => m.format('YYYY-MM-DD'));

const GET_MEDIAN_PRICE = (dates) => gql`
  query(
    $type: Type
    $region: String!
  ) {
    ${dates.map((date, id) => `
      row_${id}: getMedianPrice(
        type: $type
        start_date: "${date}"
        region: $region
      ) {
        price
      }
    `)}
  }
`;

function transformResponse(data) {
  if (!data) {
    return [];
  }

  return dates.map((date, index) => {
    if (!data) {
      return {};
    }

    return {
      x: date,
      y: data[`row_${index}`].price
    };
  });
}

function PropertyPriceLine() {
  const map = useContext(MapContext);

  const [hasChangedSinceLastLoad, setHasChangedSinceLastLoad] = useState(false);
  const [region, setRegion] = useState();
  const [setRegionDebounced] = useDebouncedCallback(setRegion, 2000);
  const { loading, data: custom } = useQuery(GET_MEDIAN_PRICE(dates), {
    variables: {
      type: 'SELL',
      region: region,
    },
    skip: !region,
  });

  const data = useMemo(() => [{
    id: 'test',
    data: transformResponse(custom),
  }], [custom]);

  useEffect(() => {
    setHasChangedSinceLastLoad(true);
    setRegionDebounced(map.region);
  }, [map.region, setRegionDebounced]);

  useEffect(() => {
    setHasChangedSinceLastLoad(false);
  }, [data]);


  if (hasChangedSinceLastLoad || loading) {
    return (
      <div className={styles.chartMargin}>
        <Skeleton height={80} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ResponsiveLine
        data={data}
        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        xScale={{
            type: 'time',
            format: '%Y-%m-%d',
            precision: 'month',
        }}
        xFormat="time:%Y-%m-%d"
        yScale={{
            type: 'linear',
            stacked: false,
            legend: 'mediānā cena m2'
        }}
        yFormat={value =>
            `${Number(value).toLocaleString('lv-LV', {
                minimumFractionDigits: 2,
            })} EUR/m2`
        }
        colors={["#543193"]}
        axisLeft={{ enable: false, tickSize: 0 }}
        axisBottom={false}
        enableGridX={false}
        enableGridY={false}
        enablePoints={false}
        curve="natural"
        useMesh={false}
        enableSlices="x"
      />
    </div>
  );
}

export default PropertyPriceLine;
