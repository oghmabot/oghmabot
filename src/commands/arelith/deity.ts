import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { DeityModel } from "../../data/models";
import { ArelithWikiScraper, FandomApiProxy } from "../../data/proxies";
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
      const deityAR = await ArelithWikiScraper.fetchDeity(deityQuery);
      if (!deityAR) return msg.say('Deity not found.');

      const deityFR = await FandomApiProxy.fetchDeityDetails(deityQuery, DeityModel);
      return msg.embed(DeityModel.toEmbed({ ...deityFR, ...deityAR }));
    } catch (error) {
      console.error('[DeityCommand] Unexpected error.', error);
    }

    return msg.reply('Invalid input.');
  }
}
