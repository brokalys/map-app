import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

Bugsnag.start({
  releaseStage: import.meta.env.MODE,
  enabledReleaseStages: ['production'],
  apiKey: import.meta.env.VITE_BUGSNAG_KEY!,
  plugins: [new BugsnagPluginReact()],
  collectUserIp: false,
});

export default Bugsnag;
