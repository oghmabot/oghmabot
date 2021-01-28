import { Command } from 'discord.js-commando';
import { StatusCommand } from './status.command';
import { SubscribeCommand } from './subscribe.command';
import { UnsubscribeCommand } from './unsubscribe.command';

export const serverCommands = (): (typeof Command)[] => [
  StatusCommand,
  SubscribeCommand,
  UnsubscribeCommand,
];
