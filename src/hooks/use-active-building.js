import { useContext } from 'react';

import BuildingContext from 'context/BuildingContext';

export default function useActiveBuilding() {
  const context = useContext(BuildingContext);

  return [context.activeBuilding, context.setActiveBuilding];
}
