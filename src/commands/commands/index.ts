import { Command } from 'discord.js-commando';
import { ExpireCommand } from './expire.command';

export const commandsCommands = (): (typeof Command)[] => [
  ExpireCommand,
];
