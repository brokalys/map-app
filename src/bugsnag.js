import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

Bugsnag.start({
  releaseStage: process.env.NODE_ENV,
  enabledReleaseStages: ['production'],
  apiKey: process.env.REACT_APP_BUGSNAG_KEY,
  plugins: [new BugsnagPluginReact()],
  collectUserIp: false,
});

export default Bugsnag;
