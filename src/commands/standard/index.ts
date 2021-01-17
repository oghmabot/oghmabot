import { RollCommand } from './roll';
import { StatusCommand } from './status';
import { SubscribeCommand } from './subscribe';
import { UnsubscribeCommand } from './unsubscribe';

export const standardCommands = () => [
  RollCommand,
  StatusCommand,
  SubscribeCommand,
  UnsubscribeCommand,
];
