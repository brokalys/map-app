import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

const apiKey = import.meta.env.VITE_BUGSNAG_KEY;

if (apiKey) {
  Bugsnag.start({
    releaseStage: import.meta.env.MODE,
    enabledReleaseStages: ['production'],
    apiKey,
    plugins: [new BugsnagPluginReact()],
    collectUserIp: false,
  });
}

export default Bugsnag;
export const isBugsnagEnabled = !!apiKey;
