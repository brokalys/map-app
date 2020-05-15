import React, { useState } from 'react';
import { Header } from 'semantic-ui-react';
import { ResponsiveBar } from '@nivo/bar';

import styles from './PropertyTypeChart.module.css';

const defaultColor = '#543193';
const selectedColor = '#c0ace3';
const defaultColors = [defaultColor, defaultColor, defaultColor];

function PropertyTypeChart({ data }) {
  const [colors, setColors] = useState(defaultColors);

  function onClick({ index }) {
    setColors((state) => {
      if (state[index] === selectedColor) {
        return defaultColors;
      }

      const newColors = [...defaultColors];
      newColors[index] = selectedColor;
      return newColors;
    });
  }

  return (
    <div>
      <Header as="h4" className={styles.title}>Property type distribution</Header>
      <div className={styles.container}>
        <ResponsiveBar
          data={data}
          layout="horizontal"
          enableGridY={false}
          enableLabel={false}
          axisLeft={{ tickSize: 0 }}
          axisBottom={false}
          keys={['value']}
          indexBy="category"
          margin={{ top: 0, right: 0, bottom: 0, left: 60 }}
          animate={true}
          colors={colors}
          colorBy="index"
          padding={0.4}
          onClick={onClick}
        />
      </div>
    </div>
  );
}

export default PropertyTypeChart;
