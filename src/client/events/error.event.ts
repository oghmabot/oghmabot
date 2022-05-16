import { defaultClient } from 'applicationinsights';

import { getBotStatusChannel } from '../../utils/channels';
import { OghmabotClient } from '../oghmabot.client';

export const handleClientError = async (client: OghmabotClient, error: Error): Promise<void> => {
  const statusChannel = await getBotStatusChannel(client);
  defaultClient.trackException({ exception: error });
  statusChannel.send(stackToCodeBlock(error));
};

export const handleProcessError = handleClientError;

export const handleProcessRejection = async (client: OghmabotClient, reason: unknown): Promise<void> => {
  if (typeof reason == 'object') {
    console.error('UnhandledPromiseRejectionWarning:', reason);
    const statusChannel = await getBotStatusChannel(client);
    statusChannel.send(rejectionToCodeBlock(reason as Record<string, unknown>));
  }
};

const stackToCodeBlock = (error: Error): string => {
  const { name, message, stack } = error;
  return `${name}: ${message}`
    + stack ? '\n```prolog\n' + stack + '\n```' : '';
};

const rejectionToCodeBlock = (reason?: Record<string, unknown>): string => {
  if (reason) {
    const keys = Object.keys(reason);

    return `⚠️${reason}` +
      '```\n' + keys.map(k => `${k}: ${reason[k]}`).join('\n') + '\n```';
  }

  return '';
};
