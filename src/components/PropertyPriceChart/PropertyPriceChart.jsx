import React, { useContext, useMemo } from "react";
import { Dimmer, Loader, Segment } from "semantic-ui-react";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { gql, useQuery } from "@apollo/client";
import { ResponsiveLine } from "@nivo/line";

import FilterContext from "context/FilterContext";
import defaultData from "./default-data.json";
import styles from "./PropertyPriceChart.module.css";

const moment = extendMoment(Moment);
const range = moment().range(
  moment().utc().startOf("day").subtract(30, "days"),
  new Date()
);
const dates = Array.from(range.by("day", { excludeEnd: true }));

const GET_MEDIAN_PRICE = (dates) => gql`
  query(
    $type: String!
    $category: String!
    $region: [String!]!
  ) {
    ${dates.map(
      (date, id) => `
      row_${id}: properties(
        filter: {
          type: { eq: $type }
          category: { eq: $category }
          published_at: {
            gte: "${date.toISOString()}"
            lt: "${date.clone().add(1, "day").toISOString()}"
          }
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
    return defaultData;
  }

  return dates.map((date, index) => {
    if (!data) {
      return {};
    }

    return {
      x: date.format("YYYY-MM-DD"),
      y: data[`row_${index}`].summary.price.median,
    };
  });
}

function PropertyPriceChart() {
  const context = useContext(FilterContext);
  const { loading, data: custom } = useQuery(GET_MEDIAN_PRICE(dates), {
    variables: {
      type: context.type.selected,
      category: context.category.selected,
      region: [context.location.selectedRegion],
    },
  });

  const data = useMemo(
    () => [
      {
        id: "Median Price",
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
        margin={{ top: 10, right: 10, bottom: 100, left: 50 }}
        xScale={{
          type: "time",
          format: "%Y-%m-%d",
          precision: "day",
        }}
        xFormat="time:%Y-%m-%d"
        yScale={{
          type: "linear",
          stacked: false,
        }}
        sliceTooltip={({ slice }) => {
          return (
            <div className={styles.tooltip}>
              {slice.points.map((point) => (
                <div key={point.id}>
                  <div>
                    <strong>{moment(point.data.x).format("YYYY-MM-DD")}</strong>
                  </div>
                  <div>
                    <strong>{point.serieId}:</strong>{" "}
                    {Number(point.data.yFormatted).toLocaleString("en", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    EUR
                  </div>
                </div>
              ))}
            </div>
          );
        }}
        axisBottom={{
          format: "%Y-%m",
          tickValues: "every 2 days",
          tickRotation: -90,
        }}
        enablePoints={false}
        curve="natural"
        useMesh={true}
        enableSlices="x"
      />
    </Segment>
  );
}

export default PropertyPriceChart;
