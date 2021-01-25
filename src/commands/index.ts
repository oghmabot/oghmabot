import { Command } from 'discord.js-commando';
import { arelithCommands } from './arelith';
import { nwnCommands } from './nwn';
import { ownerCommands } from './owner';

export const getAllCommands = (): (typeof Command)[] => [
  ...arelithCommands(),
  ...nwnCommands(),
  ...ownerCommands(),
];
