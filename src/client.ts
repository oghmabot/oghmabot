import { Collection } from "discord.js";
import { CommandoClient, CommandoClientOptions } from "discord.js-commando";
import { getAllCommands } from "./commands";
import { StatusPoller } from "./data";
import { BasePoller } from "./data/common";

export class OghmabotClient extends CommandoClient {
  pollers: Collection<string, BasePoller<unknown>> = new Collection();

  constructor(options?: CommandoClientOptions) {
    super(options);
    this.setDefaultPollers();
    this.setRegistryDefaults();
  }

  setDefaultPollers(): void {
    this.pollers.set('status', new StatusPoller(this));
  }

  setRegistryDefaults(): void {
    this.registry
      .registerGroups([
        ['owner', 'Owner'],
        ['standard', 'Standard'],
        ['lore', 'Lore'],
        ['nwn', 'Neverwinter Nights'],
      ])
      .registerDefaultTypes()
      .registerDefaultGroups()
      .registerDefaultCommands({ prefix: false, unknownCommand: false })
      .registerCommands(getAllCommands());
  }
}
