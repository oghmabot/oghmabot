import { defaultClient as client, setup, start } from 'applicationinsights';

export const startAppInsights = () => {
  const {
    APPLICATIONINSIGHTS_CONNECTION_STRING,
    APPLICATIONINSIGHTS_DEBUG_MODE,
  } = process.env;

  const config = setup(APPLICATIONINSIGHTS_CONNECTION_STRING)
    .setAutoCollectDependencies(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectRequests(true)
    .setAutoDependencyCorrelation(true);

  if (APPLICATIONINSIGHTS_DEBUG_MODE) {
    if (APPLICATIONINSIGHTS_DEBUG_MODE == 'debug') {
      config.setInternalLogging(true, true);
    }
    if (APPLICATIONINSIGHTS_DEBUG_MODE == 'warn') {
      config.setInternalLogging(false, true);
    }
  }

  client.context.tags[client.context.keys.cloudRole] = 'Oghmabot';

  start();
};
