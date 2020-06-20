import { Icon, Tooltip } from '@blueprintjs/core';
import React from 'react';
import { useRecoilValue } from 'recoil';
import Skeleton from 'react-loading-skeleton';
import { Statistic } from 'semantic-ui-react';

import { getRentalYield } from 'store';

function RentalYieldInFilterLocation() {
  const data = useRecoilValue(getRentalYield);

  return <Statistic.Value>{data.toFixed(2)}%</Statistic.Value>;
}

function Description() {
  return (
    <>
      <p>
        How much of the invested capital can I expect to make back each year?
      </p>
      <p>A bigger number is better for landlords; a smaller - for renters.</p>
      <p>Calculation: average rent price / sell price in the last month</p>
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
        <Tooltip content={<Description />} children={<Icon icon="help" />} />
      </Statistic.Label>
    </Statistic>
  );
}

export default RentalYieldInFilterLocationContainer;
