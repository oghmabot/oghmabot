import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { initialize, ServerModel } from "../../data";

export class InitializeCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'initialize',
      group: 'owner',
      memberName: 'initialize',
      description: 'Initialize resources.',
      ownerOnly: true,
    });
  }

  async run(msg: CommandoMessage): Promise<any> {
    await initialize(true);
    return msg.say('Databases initialized.');
  }
}