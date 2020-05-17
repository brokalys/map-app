import React, { useContext, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { gql } from '@apollo/client';
import { Header } from 'semantic-ui-react';
import { ResponsiveBar } from '@nivo/bar';

import MapContext from 'context/MapContext';
import useDebouncedQuery from 'hooks/use-debounced-query';
import styles from './PropertyTypeChart.module.css';

const defaultColor = '#543193';
const selectedColor = '#c0ace3';
const defaultColors = [defaultColor, defaultColor, defaultColor];

const GET_MEDIAN_PRICE = gql`
  query (
    $type: String!
    $date: String!
    $region: [String!]!
  ) {
    median_price: properties(
      filter: {
        type: { eq: $type }
        published_at: { gte: $date }
        region: { in: $region }
      }
    ) {
      summary {
        price {
          median
        }
      }
    }

    apartment_count: properties(
      filter: {
        category: { eq: "APARTMENT" }
        type: { eq: $type }
        published_at: { gte: $date }
        region: { in: $region }
      }
    ) {
      summary {
        count
      }
    }

    house_count: properties(
      filter: {
        category: { eq: "HOUSE" }
        type: { eq: $type }
        published_at: { gte: $date }
        region: { in: $region }
      }
    ) {
      summary {
        count
      }
    }

    land_count: properties(
      filter: {
        category: { eq: "LAND" }
        type: { eq: $type }
        published_at: { gte: $date }
        region: { in: $region }
      }
    ) {
      summary {
        count
      }
    }
  }
`;

function normalizeChartData(data) {
  if (!data) {
    return [];
  }

  return [
    {
      category: 'Land',
      value: data.land_count.summary.count,
    },
    {
      category: 'House',
      value: data.house_count.summary.count,
    },
    {
      category: 'Apartment',
      value: data.apartment_count.summary.count,
    },
  ];
}

function PropertyTypeChart({ type, startDate }) {
  const map = useContext(MapContext);
  const { loading, data: custom } = useDebouncedQuery(GET_MEDIAN_PRICE, {
    variables: {
      type,
      date: startDate,
      region: [map.region],
    },
  }, 1000);
  const [colors, setColors] = useState(defaultColors);
  const data = useMemo(() => normalizeChartData(custom), [custom]);

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
        {loading || !data ? <Skeleton height="100%" /> : (
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
        )}
      </div>
    </div>
  );
}

export default PropertyTypeChart;
