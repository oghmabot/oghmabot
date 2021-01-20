import { loreCommands } from './lore';
import { nwnCommands } from './nwn';
import { ownerCommands } from './owner';
import { standardCommands } from './standard';

export const getAllCommands = () => [
  ...loreCommands(),
  ...nwnCommands(),
  ...ownerCommands(),
  ...standardCommands(),
];

export * from './lore';
export * from './nwn';
export * from './owner';
export * from './standard';
