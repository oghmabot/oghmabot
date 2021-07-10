import { getBotStatusChannel } from '../../utils/channels';
import { OghmabotClient } from '../oghmabot.client';

export const handleClientError = async (client: OghmabotClient, error: Error): Promise<void> => {
  const statusChannel = await getBotStatusChannel(client);
  statusChannel.send(stackToCodeBlock(error));
};

export const handleProcessError = handleClientError;

export const handleProcessRejection = async (client: OghmabotClient, reason: Record<string, unknown> | null | undefined): Promise<void> => {
  console.error('UnhandledPromiseRejectionWarning:', reason);
  const statusChannel = await getBotStatusChannel(client);
  statusChannel.send(rejectionToCodeBlock(reason));
};

const stackToCodeBlock = (error: Error): string => {
  const { name, message, stack } = error;
  return `${name}: ${message}`
    + stack ? '\n```prolog\n' + stack + '\n```' : '';
};

const rejectionToCodeBlock = (reason: Record<string, unknown> | null | undefined): string => {
  if (reason) {
    const keys = Object.keys(reason);

    return `⚠️${reason}` +
      '```\n' + keys.map(k => `${k}: ${reason[k]}`).join('\n') + '\n```';
  }

  return '';
};
