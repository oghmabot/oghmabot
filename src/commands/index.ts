import { ownerCommands } from './owner';
import { standardCommands } from './standard';

export const getAllCommands = () => [
  ...ownerCommands(),
  ...standardCommands(),
];

export * from './owner';
export * from './standard';
