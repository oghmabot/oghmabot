import { TextChannel } from 'discord.js';
import { OghmabotEmbed } from '../embeds';
import { OghmabotClient } from '../oghmabot.client';

export const handleClientError = async (client: OghmabotClient, error: Error): Promise<void> => {
  try {
    const { BOT_STATUS_CHANNEL } = process.env;
    if (BOT_STATUS_CHANNEL) {
      const { channels } = client;
      const statusChannel = await channels.fetch(BOT_STATUS_CHANNEL) as TextChannel | undefined;
      if (statusChannel) {
        statusChannel.send(new OghmabotEmbed({
          title: error.name,
          description: error.message,
        }));
      }
    }
  } catch (err) {
    console.warn('Failed to output uncaught error to Discord Status Channel.');
  }
  console.error('Unexpected error.', error);
};
