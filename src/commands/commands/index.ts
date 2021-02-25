import { Command } from 'discord.js-commando';
import { CleanupCommand } from './cleanup.command';
import { ExpireCommand } from './expire.command';

export const commandsCommands = (): (typeof Command)[] => [
  CleanupCommand,
  ExpireCommand,
];
