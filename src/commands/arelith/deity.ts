import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { DeityModel } from "../../data/models";
import { stripCommandNotation } from "../../utils";

export class DeityCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'deity',
      group: 'arelith',
      memberName: 'deity',
      description: 'Replies with the details of a deity in the Arelith pantheon.',
      args: [
        {
          key: 'deityQuery',
          type: 'string',
          prompt: 'Specify deity of which you want to find details.',
          parse: stripCommandNotation,
        },
      ],
    });
  }

  async run(msg: CommandoMessage, { deityQuery }: { deityQuery: string }): Promise<any> {
    try {
      const deity = await DeityModel.getOrAddDeity(deityQuery);
      if (!deity) return msg.say('Deity not found.');
      return msg.embed(DeityModel.toEmbed(deity));
    } catch (error) {
      console.error('[DeityCommand] Unexpected error.', error);
    }

    return msg.reply('Invalid input.');
  }
}
