import 'core-js';

import React from 'react';
import ReactDOM from 'react-dom';
import createPlugin from 'bugsnag-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'nprogress/nprogress.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const bugsnagClient = window.bugsnagClient;

if (bugsnagClient) {
  const ErrorBoundary = bugsnagClient.use(createPlugin(React));

  ReactDOM.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>,
    document.getElementById('root'),
  );
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}

registerServiceWorker();
