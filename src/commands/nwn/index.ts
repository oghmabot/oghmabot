
import { RollCommand } from './roll';
import { StatusCommand } from './status';
import { SubscribeCommand } from './subscribe';
import { UnsubscribeCommand } from './unsubscribe';

export const nwnCommands = () => [
  RollCommand,
  StatusCommand,
  SubscribeCommand,
  UnsubscribeCommand,
];
