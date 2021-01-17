import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { initialize } from '../../data';

export class InitializeCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'initialize',
      group: 'owner',
      memberName: 'initialize',
      description: 'Initialize resources.',
      ownerOnly: true,
      args: [
        {
          key: 'force',
          prompt: 'N/A',
          type: 'boolean',
          default: false,
        },
      ],
    });
  }

  async run(msg: CommandoMessage, { force }: { force: boolean }): Promise<any> {
    await initialize(force);
    return msg.say('Databases initialized.');
  }
}