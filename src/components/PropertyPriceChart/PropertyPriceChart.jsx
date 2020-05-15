import React from 'react';
import { ResponsiveLine } from '@nivo/line';

import data from 'data/chart-data-new.json';
import styles from './PropertyPriceChart.module.css';

function PropertyPriceChart() {
  return (
    <div className={styles.container}>
      <ResponsiveLine
        data={data}
        margin={{ top: 10, right: 10, bottom: 100, left: 40 }}
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
        axisBottom={{
            format: '%Y-%m',
            tickValues: 'every 2 months',
            tickRotation: -90,
        }}
        enablePoints={false}
        curve="natural"
        useMesh={true}
        enableSlices="x"
      />
    </div>
  );
}

export default PropertyPriceChart;
