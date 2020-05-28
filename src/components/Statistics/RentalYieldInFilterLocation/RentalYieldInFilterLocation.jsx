import React from "react";
import { useRecoilValue } from "jared-recoil";
import Skeleton from "react-loading-skeleton";
import { Statistic } from "semantic-ui-react";

import { getRentalYield } from "store";

function RentalYieldInFilterLocation() {
  const data = useRecoilValue(getRentalYield);

  return <Statistic.Value>{data.toFixed(2)}%</Statistic.Value>;
}

function RentalYieldInFilterLocationContainer() {
  return (
    <Statistic>
      <React.Suspense fallback={<Skeleton height={42} />}>
        <RentalYieldInFilterLocation />
      </React.Suspense>
      <Statistic.Label>Rental Yield</Statistic.Label>
    </Statistic>
  );
}

export default RentalYieldInFilterLocationContainer;
