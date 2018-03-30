import React from 'react';
import {
  XAxis,
  YAxis,
  HorizontalGridLines,
  FlexibleWidthXYPlot,
  LineSeries,
  DiscreteColorLegend
} from 'react-vis';
import parse from 'csv-parse/lib/es5/sync';

class Daily extends React.Component {

  state = {
    lastDrawLocation: null,
    series: []
  }

  async loadData() {
    const response = await fetch('https://raw.githubusercontent.com/brokalys/data/master/data/daily-sell.csv');
    const csvData = await response.text();
    const data = parse(csvData);

    let num = 0;
    this.setState({
      series: [{
        title: 'test',
        data: data.splice(1).map((row) => ({
          y: parseInt(row[5], 10),
          x: num++,
        })),
      }],
    });
  }

  render() {
    this.loadData();

    const {series, lastDrawLocation} = this.state;
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
          this.setState({lastDrawLocation: null});
        }}>
          Reset Zoom
        </button>
      </div>
    );
  }

}

export default Daily;
