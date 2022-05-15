import { setup as setupAppInsights } from 'applicationinsights';
import dotenv from 'dotenv';
import express from 'express';

import { OghmabotClient } from './client';
import { scheduleAllJobs } from './data/jobs';

/**
 * Set environment variables from .env, if present
 * @ignore
 */
dotenv.config();

const {
  APPLICATIONINSIGHTS_CONNECTION_STRING,
  BOT_OWNER,
  BOT_PREFIX,
  BOT_SUPPORT_INVITE,
  BOT_TOKEN,
  PORT = 80,
} = process.env;

const client = new OghmabotClient({
  owner: BOT_OWNER,
  commandPrefix: BOT_PREFIX || '-',
  invite: BOT_SUPPORT_INVITE,
});

/**
 * Login to the Discord service
 * @ignore
 */
client.login(BOT_TOKEN);

/**
 * Start application insights collection
 */
if (APPLICATIONINSIGHTS_CONNECTION_STRING) {
  setupAppInsights(APPLICATIONINSIGHTS_CONNECTION_STRING).start();
}

/**
 * Schedule routine jobs
 * @ignore
 */
scheduleAllJobs();

/**
 * Listen to incoming requests to satisfy health checks
 * @ignore
 */
const app = express();
app.get('/', (_, response) => response.send());
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
