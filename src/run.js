const prompt  = require('prompt');
const mysql   = require('mysql');
const moment  = require('moment');
const regions = require('../public/js/regions.js');

require('dotenv').config();

prompt.start();

const schema = {
  properties: {
    mode: {
      description: 'Mode (median / avg)',
      default: 'median',
    },
    category: {
      description: 'Category',
      default: 'apartment',
    },
    type: {
      description: 'Type',
      default: 'sell',
    },
    month: {
      description: 'Month (YYYY-MM-DD)',
      pattern: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
      default: moment().remove(1, 'month').startOf('month').format('YYYY-MM-DD'),
    },
  },
};

prompt.get(schema, (err, result) => {
  if (err) throw err;
  const month = moment(result.month);

  const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
  });

  connection.connect();

  Object.keys(regions).forEach((regionKey) => {
    const region = regions[regionKey].map((row) => row.join(' ')).join(', ');

    const query = `
      SELECT price
      FROM ??
      WHERE category = ?
        AND type = ?
        AND created_at >= ?
        AND created_at < ?
        AND ST_Contains(ST_GeomFromText('POLYGON((${region}))'), point(lng, lat))
    `;

    connection.query(query, [
      process.env.DB_TABLE_PROPERTIES,
      result.category,
      result.type,
      month.startOf('month').toISOString(),
      month.endOf('month').toISOString(),
    ], (error, results) => {
      if (error) throw error;
      if (results.length < 10) return;

      const prices = results.map((row) => row.price);
      const price = Math.round(result.mode === 'avg'
        ? (prices.reduce((a, b) => a + b) / prices.length)
        : median(prices));

      if (price) {
        console.log(`${regionKey}: ${price},`);
      }
    });
  });

  connection.end();
});

function median(values) {
  values.sort((a, b) => a - b);

  const half = Math.floor(values.length / 2);

  if (values.length % 2) {
    return values[half];
  }

  return (values[half - 1] + values[half]) / 2;
}
