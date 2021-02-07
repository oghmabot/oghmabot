import { Command } from 'discord.js-commando';
import { BuildCommand } from './build.command';
import { RollCommand } from './roll.command';
import { StatsCommand } from './stats.command';

export const mechanicsCommands = (): (typeof Command)[] => [
  BuildCommand,
  RollCommand,
  StatsCommand,
];
