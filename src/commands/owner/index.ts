import { Command } from 'discord.js-commando';
import { ResetCommand } from './reset.command';
import { ServerCommand } from './server.command';

export const ownerCommands = (): (typeof Command)[] => [
  ResetCommand,
  ServerCommand,
];
