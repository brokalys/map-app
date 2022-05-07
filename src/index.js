import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'react-loading-skeleton/dist/skeleton.css';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { QueryParamProvider } from 'use-query-params';

import App from './App.jsx';
import client from './apollo-client';
import Bugsnag from './bugsnag';
import { MapContext } from './hooks/use-map-context';
import './index.css';
import * as serviceWorker from './serviceWorker';

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

const RouteAdapter = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const adaptedHistory = React.useMemo(
    () => ({
      replace(location) {
        navigate(location, { replace: true, state: location.state });
      },
      push(location) {
        navigate(location, { replace: false, state: location.state });
      },
    }),
    [navigate],
  );
  return children({ history: adaptedHistory, location });
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ErrorBoundary>
    <BrowserRouter>
      <QueryParamProvider ReactRouterRoute={RouteAdapter}>
        <ApolloProvider client={client}>
          <MapContext>
            <App />
          </MapContext>
        </ApolloProvider>
      </QueryParamProvider>
    </BrowserRouter>
  </ErrorBoundary>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
