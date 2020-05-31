import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { Dimmer, Header, Loader, Segment } from 'semantic-ui-react';
import { ResponsiveBar } from '@nivo/bar';

import useDebouncedQuery from 'hooks/use-debounced-query';
import useRegionParams from 'hooks/use-region-params';
import styles from './PropertyTypeChart.module.css';

const defaultColor = '#543193';
const selectedColor = '#c0ace3';
const defaultColors = [defaultColor, defaultColor, defaultColor];

const GET_MEDIAN_PRICE = gql`
  query(
    $type: String!
    $date: String!
    $region: [String!]!
    $locations: [String!]
  ) {
    median_price: properties(
      filter: {
        type: { eq: $type }
        published_at: { gte: $date }
        location_classificator: { in: $locations }
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
        location_classificator: { in: $locations }
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
        location_classificator: { in: $locations }
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
        location_classificator: { in: $locations }
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
  return [
    {
      category: 'Land',
      value: data ? data.land_count.summary.count : 0,
    },
    {
      category: 'House',
      value: data ? data.house_count.summary.count : 0,
    },
    {
      category: 'Apartment',
      value: data ? data.apartment_count.summary.count : 0,
    },
  ];
}

function PropertyTypeChart({ type, startDate }) {
  const { region, locations } = useRegionParams();

  const { loading, data } = useDebouncedQuery(
    GET_MEDIAN_PRICE,
    {
      variables: {
        type,
        date: startDate,
        region,
        locations,
      },
    },
    1000
  );
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
      <Header as="h4" className={styles.title}>
        Property type distribution
      </Header>
      <Segment basic className={styles.container}>
        <Dimmer inverted active={loading}>
          <Loader />
        </Dimmer>

        <ResponsiveBar
          data={normalizeChartData(data)}
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
          padding={0.4}
          onClick={onClick}
        />
      </Segment>
    </div>
  );
}

export default PropertyTypeChart;
