import { ApolloProvider } from '@apollo/client';
import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'react-loading-skeleton/dist/skeleton.css';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { QueryParamProvider } from 'use-query-params';

import App from './App.jsx';
import client from './apollo-client';
import Bugsnag from './bugsnag';
import './index.css';
import * as serviceWorker from './serviceWorker';
import store, { history } from './store';

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ErrorBoundary>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <QueryParamProvider ReactRouterRoute={Route}>
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </QueryParamProvider>
      </ConnectedRouter>
    </Provider>
  </ErrorBoundary>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
