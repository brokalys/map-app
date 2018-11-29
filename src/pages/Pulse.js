import React from 'react';
import Trend from 'react-trend';
import parse from 'csv-parse/lib/es5/sync';

class Pulse extends React.Component {

  state = {
    data: [],
    start: '',
    end: '',
  }

  async loadData() {
    const response = await fetch('https://raw.githubusercontent.com/brokalys/data/master/data/apartment/sell-monthly-riga.csv');
    const csvData = await response.text();
    const data = parse(csvData);

    const mappedData = [];
    const header = data[0];
    const body = data.splice(1);
    const start = body[0][0];
    const end = body[body.length - 1][1];

    header.forEach((row, index) => {
      if (index <= 1) {
        return;
      }

      const prices = body.map((row) => parseInt(row[index], 10)).filter((price) => price > 0);

      if (prices.length === 0) {
        return;
      }

      mappedData.push({
        name: row === 'Rīga' ? 'Vidējais rādītājs Rīgā' : row,
        data: prices,
      });
    });

    this.setState({
      start,
      end,
      data: mappedData,
    });
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    const { data, start, end } = this.state;

    return (
      <div className="container">
        <h1>Nekustamā īpašuma pulss Rīgā</h1>
        <h2>{start} - {end}</h2>
        <hr />

        {data.map((row) => {
          return (
            <div key={row.name}>
              <h3>{row.name}</h3>
              <Trend data={row.data} autoDraw gradient={['#0FF', '#F0F', '#FF0']} smooth />
              <hr />
            </div>
          );
        })}
      </div>
    );
  }

}

export default Pulse;
