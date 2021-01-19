import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

export class DeityCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'deity',
      group: 'lore',
      memberName: 'deity',
      description: 'Replies with the details of a deity in the Arelith pantheon.',
      args: [
        {
          key: 'deity',
          type: 'string',
          prompt: 'Specify deity of which you want to find details.'
        },
      ],
    });
  }

  async run(msg: CommandoMessage, { deity }: { deity: string }): Promise<any> {
    return;
  }
}
