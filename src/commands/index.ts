import { Command } from 'discord.js-commando';
import { loreCommands } from './lore';
import { mechanicsCommands } from './mechanics';
import { ownerCommands } from './owner';
import { serverCommands } from './server';

export const getAllCommands = (): (typeof Command)[] => [
  ...loreCommands(),
  ...mechanicsCommands(),
  ...ownerCommands(),
  ...serverCommands(),
];
