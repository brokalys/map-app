import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { Icon, Popup, Statistic } from 'semantic-ui-react';

import useRentalYield from 'src/hooks/api/use-rental-yield';

function RentalYieldInFilterLocation() {
  const data = useRentalYield();
  const value = data ? `${data.toFixed(2)}%` : '?';

  return <Statistic.Value>{value}</Statistic.Value>;
}

function Description() {
  return (
    <>
      <p>
        How much of the invested capital can I expect to make back each year?
      </p>
      <p>A bigger number is better for landlords; a smaller - for renters.</p>
      <p>Calculation: average rent price per sqm * 12 / sell price per sqm</p>
    </>
  );
}

function RentalYieldInFilterLocationContainer() {
  return (
    <Statistic>
      <React.Suspense fallback={<Skeleton height={42} />}>
        <RentalYieldInFilterLocation />
      </React.Suspense>
      <Statistic.Label>
        Rental Yield{' '}
        <Popup
          content={<Description />}
          trigger={<Icon name="help circle" />}
        />
      </Statistic.Label>
    </Statistic>
  );
}

export default RentalYieldInFilterLocationContainer;
