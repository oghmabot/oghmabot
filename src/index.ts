import dotenv from 'dotenv';
import { OghmabotClient } from './client';

/**
 * Set environment variables from .env, if present
 * @ignore
 */
dotenv.config();

const {
  BOT_OWNER,
  BOT_PREFIX,
  BOT_TOKEN,
} = process.env;

const client = new OghmabotClient({
  owner: BOT_OWNER,
  commandPrefix: BOT_PREFIX || '-',
});

/**
 * Login to the Discord service
 * @ignore
 */
client.login(BOT_TOKEN);
