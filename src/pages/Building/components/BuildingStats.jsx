import PropType from 'prop-types';
import { Grid, Statistic } from 'semantic-ui-react';

function calcAvg(nums) {
  if (nums.length === 0) return 0;
  return nums.reduce((carry, num) => carry + num, 0) / nums.length;
}

export default function BuildingStats(props) {
  const min = {
    total: Math.round(Math.min(...props.prices.total)),
    sqm: Math.round(Math.min(...props.prices.sqm)),
  };
  const avg = {
    total: Math.round(calcAvg(props.prices.total)),
    sqm: Math.round(calcAvg(props.prices.sqm)),
  };
  const max = {
    total: Math.round(Math.max(...props.prices.total)),
    sqm: Math.round(Math.max(...props.prices.sqm)),
  };

  return (
    <Grid textAlign="center">
      <Grid.Row columns={3} divided>
        <Grid.Column>
          <Statistic size="small">
            <Statistic.Label>Min</Statistic.Label>
            <Statistic.Value>
              {min.total.toLocaleString()}
              <small>€</small>
            </Statistic.Value>
            <Statistic.Label>
              ({min.sqm.toLocaleString()}{' '}
              <small>
                €/m<sup>2</sup>
              </small>
              )
            </Statistic.Label>
          </Statistic>
        </Grid.Column>

        <Grid.Column>
          <Statistic size="small">
            <Statistic.Label>Average</Statistic.Label>
            <Statistic.Value>
              {avg.total.toLocaleString()}
              <small>€</small>
            </Statistic.Value>
            <Statistic.Label>
              ({avg.sqm.toLocaleString()}{' '}
              <small>
                €/m<sup>2</sup>
              </small>
              )
            </Statistic.Label>
          </Statistic>
        </Grid.Column>

        <Grid.Column>
          <Statistic size="small">
            <Statistic.Label>Max</Statistic.Label>
            <Statistic.Value>
              {max.total.toLocaleString()}
              <small>€</small>
            </Statistic.Value>
            <Statistic.Label>
              ({max.sqm.toLocaleString()}{' '}
              <small>
                €/m<sup>2</sup>
              </small>
              )
            </Statistic.Label>
          </Statistic>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

const priceObject = PropType.shape({
  total: PropType.arrayOf(PropType.number).isRequired,
  sqm: PropType.arrayOf(PropType.number).isRequired,
}).isRequired;

BuildingStats.propTypes = {
  prices: priceObject,
};
