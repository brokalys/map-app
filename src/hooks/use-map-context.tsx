import React, { useContext, useState } from 'react';

const Context = React.createContext<[Object, Function]>([{}, () => {}]);

export default function useMapContext() {
  return useContext(Context);
}

interface MapContextProps {
  children: React.ReactNode;
}

export const MapContext: React.FC<MapContextProps> = (props) => {
  const state = useState({});

  return <Context.Provider value={state}>{props.children}</Context.Provider>;
};
