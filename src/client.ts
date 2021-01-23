import { Collection } from "discord.js";
import { CommandoClient, CommandoClientOptions } from "discord.js-commando";
import { BasePoller } from "./data/proxies/poller";

export class OghmabotClient extends CommandoClient {
  pollers: Collection<string, BasePoller<unknown>>;

  constructor(options?: CommandoClientOptions) {
    super(options);
    this.pollers = new Collection();
  }
}
