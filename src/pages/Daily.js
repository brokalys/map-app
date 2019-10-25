import React, { useState } from 'react';
import {
  XAxis,
  YAxis,
  HorizontalGridLines,
  FlexibleWidthXYPlot,
  LineSeries,
  DiscreteColorLegend
} from 'react-vis';
import parse from 'csv-parse/lib/es5/sync';
import fetch from 'cross-fetch';

function Daily() {
  const [lastDrawLocation, setLastDrawLocation] = useState(null);
  const [series, setSeries] = useState([]);

  if (series.length === 0) {
    loadData(setSeries);
  }

  return (
    <div className="example-with-click-me">
      <div className="legend">
        <DiscreteColorLegend
          width={180}
          items={series}/>
      </div>

      <div className="chart no-select">
        <FlexibleWidthXYPlot
          animation
          xDomain={lastDrawLocation && [lastDrawLocation.left, lastDrawLocation.right]}
          height={300}>

          <HorizontalGridLines />

          <YAxis />
          <XAxis />

          {series.map(entry => (
            <LineSeries
              key={entry.title}
              data={entry.data}
            />
          ))}

        </FlexibleWidthXYPlot>
      </div>

      <button className="showcase-button" onClick={() => {
        setLastDrawLocation(null);
      }}>
        Reset Zoom
      </button>
    </div>
  );
}

async function loadData(setSeries) {
  const response = await fetch('https://raw.githubusercontent.com/brokalys/data/master/data/daily-sell.csv');
  const csvData = await response.text();
  const data = parse(csvData);

  let num = 0;

  setSeries([{
    title: 'test',
    data: data.splice(1).map((row) => ({
      y: parseInt(row[5], 10),
      x: num++,
    })),
  }]);
}

export default Daily;
