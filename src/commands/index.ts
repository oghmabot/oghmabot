import { nwnCommands } from './nwn';
import { ownerCommands } from './owner';
import { standardCommands } from './standard';

export const getAllCommands = () => [
  ...nwnCommands(),
  ...ownerCommands(),
  ...standardCommands(),
];

export * from './nwn';
export * from './owner';
export * from './standard';
