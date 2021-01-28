import { Command } from 'discord.js-commando';
import { RollCommand } from './roll.command';

export const mechanicsCommands = (): (typeof Command)[] => [
  RollCommand,
];
