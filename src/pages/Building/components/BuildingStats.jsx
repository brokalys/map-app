import PropType from 'prop-types';
import { Grid, Statistic } from 'semantic-ui-react';

function calcAvg(nums) {
  return nums.reduce((carry, num) => carry + num, 0) / nums.length;
}

export default function BuildingStats(props) {
  const min = {
    total: Math.min(...props.prices.total),
    sqm: Math.min(...props.prices.sqm),
  };
  const avg = {
    total: parseInt(calcAvg(props.prices.total), 10),
    sqm: parseInt(calcAvg(props.prices.sqm), 10),
  };
  const max = {
    total: Math.max(...props.prices.total),
    sqm: Math.max(...props.prices.sqm),
  };

  return (
    <Grid columns={3} textAlign="center" divided>
      <Grid.Row>
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

BuildingStats.propTypes = {
  prices: PropType.shape({
    total: PropType.arrayOf(PropType.number).isRequired,
    sqm: PropType.arrayOf(PropType.number).isRequired,
  }).isRequired,
};
