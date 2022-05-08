import { ApolloProvider } from '@apollo/client';
import type { Location } from 'history';
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'react-loading-skeleton/dist/skeleton.css';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { QueryParamProvider } from 'use-query-params';

import App from './App';
import client from './apollo-client';
import Bugsnag from './bugsnag';
import { MapContext } from './hooks/use-map-context';
import './index.css';

const ErrorBoundary = Bugsnag.getPlugin('react')!.createErrorBoundary(React);

// @ts-expect-error
const RouteAdapter: React.FC = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const adaptedHistory = React.useMemo(
    () => ({
      replace(location: Location) {
        navigate(location, { replace: true, state: location.state });
      },
      push(location: Location) {
        navigate(location, { replace: false, state: location.state });
      },
    }),
    [navigate],
  );
  return children({ history: adaptedHistory, location });
};

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <>
    {/* @ts-expect-error */}
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
    </ErrorBoundary>
    ,
  </>,
);
