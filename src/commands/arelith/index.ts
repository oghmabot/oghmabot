import { Command } from 'discord.js-commando';
import { DeityCommand } from './deity.command';

export const arelithCommands = (): (typeof Command)[] => [
  DeityCommand,
];
