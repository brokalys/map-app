import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'react-loading-skeleton/dist/skeleton.css';
import { HashRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

import App from './App';
import client from './apollo-client';
import Bugsnag from './bugsnag';
import { MapContext } from './hooks/use-map-context';
import './index.css';

const ErrorBoundary = Bugsnag.getPlugin('react')!.createErrorBoundary(React);

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <ErrorBoundary>
    <HashRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <ApolloProvider client={client}>
          <MapContext>
            <App />
          </MapContext>
        </ApolloProvider>
      </QueryParamProvider>
    </HashRouter>
  </ErrorBoundary>,
);
