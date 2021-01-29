import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { DeityEmbed } from '../../client';
import { DeityModel } from '../../data/models';
import { stripCommandNotation } from '../../utils';

export class DeityCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'deity',
      group: 'lore',
      memberName: 'deity',
      description: 'Replies with the details of a deity in the Arelith pantheon.',
      details: 'The command will return one deity based on the given input, assuming it is listed on Arelith\'s Deity Table. Results show aggregated information from the Arelith Wiki, The Forgotten Realms Wiki, and The Forgotten Realms Cormyr Wiki.',
      args: [
        {
          key: 'name',
          type: 'string',
          prompt: 'Specify deity by name.',
          parse: stripCommandNotation,
        },
      ],
      throttling: {
        duration: 10,
        usages: 2,
      },
      examples: [
        '-deity oghma',
      ],
    });
  }

  async run(msg: CommandoMessage, { name }: { name: string }): Promise<Message> {
    try {
      const deity = await DeityModel.fetch(name);
      if (deity) return msg.embed(new DeityEmbed(deity));
    } catch (error) {
      console.error('[DeityCommand] Unexpected error.', error);
    }

    return msg.say('Deity not found.');
  }
}
