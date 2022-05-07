import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'react-loading-skeleton/dist/skeleton.css';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { QueryParamProvider } from 'use-query-params';

import App from './App.jsx';
import client from './apollo-client';
import Bugsnag from './bugsnag';
import { MapContext } from './hooks/use-map-context';
import './index.css';
import * as serviceWorker from './serviceWorker';

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ErrorBoundary>
    <Router>
      <QueryParamProvider ReactRouterRoute={Route}>
        <ApolloProvider client={client}>
          <MapContext>
            <App />
          </MapContext>
        </ApolloProvider>
      </QueryParamProvider>
    </Router>
  </ErrorBoundary>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
