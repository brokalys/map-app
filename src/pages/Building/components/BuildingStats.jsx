import PropType from 'prop-types';
import { Grid, Statistic } from 'semantic-ui-react';

import useMapCenter from 'src/hooks/use-map-center';

import BuildingPriceBarChart from './BuildingPriceBarChart';

function calcAvg(nums) {
  if (nums.length === 0) return 0;
  return nums.reduce((carry, num) => carry + num, 0) / nums.length;
}

export default function BuildingStats(props) {
  const { zoom } = useMapCenter();
  const min = {
    total: Math.min(...props.prices.total),
    sqm: Math.min(...props.prices.sqm),
  };
  const avg = {
    total: Math.round(calcAvg(props.prices.total)),
    sqm: Math.round(calcAvg(props.prices.sqm)),
  };
  const regionAvg = {
    total: Math.round(calcAvg(props.regionPrices.data.total)),
    sqm: Math.round(calcAvg(props.regionPrices.data.sqm)),
  };
  const max = {
    total: Math.max(...props.prices.total),
    sqm: Math.max(...props.prices.sqm),
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

      {zoom >= 17 ? (
        <>
          {!props.regionPrices.error && (
            <div>
              <h3>Average price comparison with active region</h3>
            </div>
          )}

          <Grid.Row columns={2} divided>
            <Grid.Column style={{ height: 200 }}>
              <BuildingPriceBarChart
                loading={props.regionPrices.loading}
                error={props.regionPrices.error}
                priceCurrentBuilding={avg.total}
                priceActiveRegion={regionAvg.total}
                labelFormat={(value) =>
                  `${value > 0 ? value.toLocaleString() : '?'} €`
                }
              />
            </Grid.Column>
            <Grid.Column style={{ height: 200 }}>
              <BuildingPriceBarChart
                loading={props.regionPrices.loading}
                error={props.regionPrices.error}
                priceCurrentBuilding={avg.sqm}
                priceActiveRegion={regionAvg.sqm}
                labelFormat={(value) =>
                  `${value > 0 ? value.toLocaleString() : '?'} €/m2`
                }
              />
            </Grid.Column>
          </Grid.Row>
        </>
      ) : null}
    </Grid>
  );
}

const priceObject = PropType.shape({
  total: PropType.arrayOf(PropType.number).isRequired,
  sqm: PropType.arrayOf(PropType.number).isRequired,
}).isRequired;

BuildingStats.propTypes = {
  prices: priceObject,
  regionPrices: PropType.shape({
    loading: PropType.bool.isRequired,
    error: PropType.object,
    data: priceObject,
  }).isRequired,
};
