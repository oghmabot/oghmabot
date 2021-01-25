import { Command } from 'discord.js-commando';
import { InitializeCommand } from './initialize.command';
import { ServerCommand } from './server.command';

export const ownerCommands = (): (typeof Command)[] => [
  InitializeCommand,
  ServerCommand,
];
