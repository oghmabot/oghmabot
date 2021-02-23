import dotenv from 'dotenv';
import { OghmabotClient } from './client';
import { scheduleAllJobs } from './data/jobs';

/**
 * Set environment variables from .env, if present
 * @ignore
 */
dotenv.config();

const {
  BOT_OWNER,
  BOT_PREFIX,
  BOT_SUPPORT_INVITE,
  BOT_TOKEN,
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
 * Schedule routine jobs
 * @ignore
 */
scheduleAllJobs();
