import { TextChannel } from 'discord.js';
import { OghmabotClient } from '../client';

export const getBotStatusChannel = async (client: OghmabotClient): Promise<TextChannel> => {
  const { BOT_STATUS_CHANNEL } = process.env;
  if (!BOT_STATUS_CHANNEL) throw new Error('Status channel is not defined.');

  return await client.channels.fetch(BOT_STATUS_CHANNEL) as TextChannel;
};
