import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { ErrorBoundary } from "react-error-boundary";
import { Dimmer, Loader, Message, Segment } from "semantic-ui-react";
import moment from "moment";
import { ResponsiveLine } from "@nivo/line";

import Bugsnag from "bugsnag";
import { getPricesInFilteredLocation } from "recoil/selectors";
import styles from "./PropertyPriceChart.module.css";

function PropertyPriceChart() {
  const responseData = useRecoilValue(getPricesInFilteredLocation);

  const data = useMemo(
    () => [
      {
        id: "Median Price",
        data: responseData.map((row) => ({
          x: row.start,
          y: row.value > 0 ? row.value : null,
        })),
      },
    ],
    [responseData]
  );

  return (
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
  );
}

function PropertyPriceChartContainer() {
  return (
    <Segment basic className={styles.container}>
      <ErrorBoundary
        fallback={
          <Message negative>
            Failed loading chart data. Please try again later.
          </Message>
        }
        onError={Bugsnag.notify}
      >
        <React.Suspense
          fallback={
            <Dimmer inverted active>
              <Loader />
            </Dimmer>
          }
        >
          <PropertyPriceChart />
        </React.Suspense>
      </ErrorBoundary>
    </Segment>
  );
}

export default PropertyPriceChartContainer;
