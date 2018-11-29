import 'core-js';

import React from 'react';
import ReactDOM from 'react-dom';
import bugsnagReact from '@bugsnag/plugin-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'nprogress/nprogress.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const bugsnagClient = window.bugsnagClient;

if (bugsnagClient) {
  bugsnagClient.use(bugsnagReact, React);
  const ErrorBoundary = bugsnagClient.getPlugin('react');

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
