import React from 'react';

function Loading(props) {
  if (props.error) {
    return <div>Error!</div>;
  }

  if (props.pastDelay) {
    return <div>Loading...</div>;
  }

  return null;
}

export default Loading;
