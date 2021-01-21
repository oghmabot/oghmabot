import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { DeityModel } from "../../data/models";
import { fetchDeity, fetchDeityDetails } from "../../data/proxy";

export class DeityCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'deity',
      group: 'lore',
      memberName: 'deity',
      description: 'Replies with the details of a deity in the Arelith pantheon.',
      args: [
        {
          key: 'deityQuery',
          type: 'string',
          prompt: 'Specify deity of which you want to find details.',
        },
      ],
    });
  }

  async run(msg: CommandoMessage, { deityQuery }: { deityQuery: string }): Promise<any> {
    const deityAR = await fetchDeity(deityQuery);

    if (deityAR) {
      const deityFR = await fetchDeityDetails(deityQuery, DeityModel);
      return msg.embed(DeityModel.toEmbed({ ...deityFR, ...deityAR }));
    }

    return msg.say('Deity not found.');
  }
}
