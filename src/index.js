import { ApolloProvider } from '@apollo/client';
import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
// @todo: re-enable when the issue is fixed and a new version of formatic-ui is released
// @see: https://github.com/Semantic-Org/Semantic-UI-React/issues/4227
// import 'semantic-ui-css/semantic.min.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { Provider } from 'react-redux';

import App from './App.jsx';
import client from './apollo-client';
import Bugsnag from './bugsnag';
import './index.css';
import * as serviceWorker from './serviceWorker';
import store, { history } from './store';

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </ConnectedRouter>
    </Provider>
  </ErrorBoundary>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
