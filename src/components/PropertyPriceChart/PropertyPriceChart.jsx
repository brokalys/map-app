import React, { useContext, useMemo } from "react";
import { Dimmer, Loader, Message, Segment } from "semantic-ui-react";
import moment from "moment";
import { ResponsiveLine } from "@nivo/line";

import FilterContext from "context/FilterContext";
import useBrokalysStaticApi from "hooks/use-brokalys-static-api";
import styles from "./PropertyPriceChart.module.css";

function PropertyPriceChart() {
  const context = useContext(FilterContext);
  const [{ loading, error, data: responseData }] = useBrokalysStaticApi(
    context.category.selected,
    context.type.selected,
    context.location.selected
  );

  const data = useMemo(
    () => [
      {
        id: "Median Price",
        data: responseData.map((row) => ({
          x: row.start,
          y: row.price > 0 ? row.price : null,
        })),
      },
    ],
    [responseData]
  );

  if (error) {
    return (
      <Message
        negative
        content="An unexpected error occurred loading the chart. Please try again later."
      />
    );
  }

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
          precision: "month",
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
          tickValues: "every 2 months",
          tickRotation: -90,
        }}
        enablePoints={true}
        curve="monotoneX"
        useMesh={true}
        enableSlices="x"
      />
    </Segment>
  );
}

export default PropertyPriceChart;
