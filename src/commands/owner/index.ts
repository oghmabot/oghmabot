import { InitializeCommand } from './initialize';
import { ServerCommand } from './server';

export const ownerCommands = () => [
  InitializeCommand,
  ServerCommand,
];
