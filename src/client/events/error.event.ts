import { TextChannel } from 'discord.js';
import { OghmabotClient } from '../oghmabot.client';

export const handleClientError = async (client: OghmabotClient, error: Error): Promise<void> => {
  try {
    const { BOT_STATUS_CHANNEL } = process.env;
    if (BOT_STATUS_CHANNEL) {
      const { channels } = client;
      const statusChannel = await channels.fetch(BOT_STATUS_CHANNEL) as TextChannel | undefined;
      if (statusChannel) {
        statusChannel.send(stackToCodeBlock(error));
      }
    }
  } catch (err) {
    console.warn('Failed to output uncaught error to Discord Status Channel.');
  }
  console.error('Unexpected error.', error);
};

const stackToCodeBlock = (error: Error): string => {
  const { name, message, stack } = error;
  return `${name}: ${message}`
    + stack ? '\n```prolog\n' + stack + '\n```' : '';
};
