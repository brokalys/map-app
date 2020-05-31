import React, { useMemo } from 'react';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { gql } from '@apollo/client';
import { ResponsiveLine } from '@nivo/line';

import useDebouncedQuery from 'hooks/use-debounced-query';
import useRegionParams from 'hooks/use-region-params';
import styles from './PropertyPriceLine.module.css';

const moment = extendMoment(Moment);
const range = moment().range(
  moment().utc().startOf('day').subtract(30, 'days'),
  new Date()
);
const dates = Array.from(range.by('day', { excludeEnd: true }));

const GET_MEDIAN_PRICE = (dates) => gql`
  query(
    $type: String!
    $region: [String!]!
    $locations: [String!]
  ) {
    ${dates.map(
      (date, id) => `
      row_${id}: properties(
        filter: {
          type: { eq: $type }
          published_at: {
            gte: "${date.toISOString()}"
            lte: "${date.clone().endOf('day').toISOString()}"
          }
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
    `
    )}
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
      x: date.format('YYYY-MM-DD'),
      y: data[`row_${index}`].summary.price.median,
    };
  });
}

function PropertyPriceLine({ type }) {
  const { region, locations } = useRegionParams();
  const { loading, data: custom } = useDebouncedQuery(
    GET_MEDIAN_PRICE(dates),
    {
      variables: {
        type,
        region,
        locations,
      },
    },
    2000
  );

  const data = useMemo(
    () => [
      {
        id: 'Median price',
        data: transformResponse(custom),
      },
    ],
    [custom]
  );

  return (
    <Segment basic className={styles.container}>
      <Dimmer inverted active={loading}>
        <Loader />
      </Dimmer>

      <ResponsiveLine
        data={data}
        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        xScale={{
          type: 'time',
          format: '%Y-%m-%d',
          precision: 'day',
        }}
        xFormat="time:%Y-%m-%d"
        yScale={{
          type: 'linear',
          stacked: false,
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
                    <strong>{point.serieId}:</strong>{' '}
                    {Number(point.data.yFormatted).toLocaleString('en', {
                      minimumFractionDigits: 2,
                    })}{' '}
                    EUR
                  </div>
                </div>
              ))}
            </div>
          );
        }}
        colors={['#543193']}
        axisLeft={{ enable: false, tickSize: 0 }}
        axisBottom={false}
        enableGridX={false}
        enableGridY={false}
        enablePoints={false}
        curve="natural"
        useMesh={false}
        enableSlices="x"
      />
    </Segment>
  );
}

export default PropertyPriceLine;
