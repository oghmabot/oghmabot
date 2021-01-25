import { Command } from 'discord.js-commando';
import { RollCommand } from './roll.command';
import { StatusCommand } from './status.command';
import { SubscribeCommand } from './subscribe.command';
import { UnsubscribeCommand } from './unsubscribe.command';

export const nwnCommands = (): (typeof Command)[] => [
  RollCommand,
  StatusCommand,
  SubscribeCommand,
  UnsubscribeCommand,
];
