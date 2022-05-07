import React, { useContext, useState } from 'react';

const Context = React.createContext();

export default function useMapContext() {
  return useContext(Context);
}

export const MapContext = (props) => {
  const state = useState({});

  return <Context.Provider value={state}>{props.children}</Context.Provider>;
};
