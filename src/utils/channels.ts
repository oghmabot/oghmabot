import { TextChannel } from 'discord.js';
import { OghmabotClient, OghmabotError } from '../client';

export const getBotStatusChannel = async (client: OghmabotClient): Promise<TextChannel> => {
  const { BOT_STATUS_CHANNEL } = process.env;
  if (!BOT_STATUS_CHANNEL) throw new OghmabotError('Status channel is not defined.', client);

  return await client.channels.fetch(BOT_STATUS_CHANNEL) as TextChannel;
};
