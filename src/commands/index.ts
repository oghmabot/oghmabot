import { Command } from 'discord.js-commando';
import { commandsCommands } from './commands';
import { loreCommands } from './lore';
import { mechanicsCommands } from './mechanics';
import { ownerCommands } from './owner';
import { serverCommands } from './server';

export const getAllCommands = (): (typeof Command)[] => [
  ...commandsCommands(),
  ...loreCommands(),
  ...mechanicsCommands(),
  ...ownerCommands(),
  ...serverCommands(),
];
