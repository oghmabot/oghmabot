import { arelithCommands } from './arelith';
import { nwnCommands } from './nwn';
import { ownerCommands } from './owner';

export const getAllCommands = () => [
  ...arelithCommands(),
  ...nwnCommands(),
  ...ownerCommands(),
];
