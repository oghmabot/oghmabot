
import { StatusCommand } from './status';
import { SubscribeCommand } from './subscribe';
import { UnsubscribeCommand } from './unsubscribe';

export const nwnCommands = () => [
  StatusCommand,
  SubscribeCommand,
  UnsubscribeCommand,
];
