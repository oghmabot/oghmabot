import { defaultClient, setup, start } from 'applicationinsights';

export const startAppInsights = () => {
  const {
    APPLICATIONINSIGHTS_CONNECTION_STRING,
    APPLICATIONINSIGHTS_DEBUG_MODE,
  } = process.env;

  if (APPLICATIONINSIGHTS_CONNECTION_STRING) {
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

    defaultClient.context.tags[defaultClient.context.keys.cloudRole] = 'Oghmabot';

    start();
  }

};
