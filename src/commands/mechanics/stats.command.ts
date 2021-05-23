import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage, FriendlyError } from 'discord.js-commando';
import { StatsEmbed } from '../../client';
import { SequelizeProvider } from '../../client/settings';
import { ClassLevelNotation, getClass, getStats, MessageExpiryModel } from '../../data/models';
import { stripCommandNotation } from '../../utils';

export class StatsCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'stats',
      group: 'mechanics',
      memberName: 'stats',
      description: 'Calculates base attack bonus and saving throws for a given class spread.',
      details: 'The command accepts input as <class><level> repeated (see examples), and it is possible to input several builds at once by separating them with commas. Keep in mind that if a build surpasses a level total of 20, the bot has to assume the first 20 levels (pre-epic) from the order of the text input; for example, "rog 13 ftr 10 wm 7" results in a pre-epic spread of rogue 13/fighter 7.',
      args: [
        {
          key: 'input',
          type: 'string',
          prompt: 'Specify the class spread you want to calculate.',
          parse: stripCommandNotation,
        },
      ],
      examples: [
        '-stats ranger 27 spec 3',
        '-stats wiz 27 rang 3, wiz 19 rang 3 wiz 7 rang 1',
        '-stats wiz 27 rang 3, wiz 19 rang 3 wiz 7 rang 1, wiz 18 rang 3 wiz 8 rang 1',
      ],
    });
  }

  async run(msg: CommandoMessage, { input }: { input: string }): Promise<Message> {
    try {
      const stats = input.split(',').map(this.parseInput).map(c => getStats(...c));
      const message = stats.find(s => s.totalLevels > 20) ? 'When given more than 20 levels, pre-epic class spread is assumed from input order.' : '';
      const responseMsg = await msg.reply(message, new StatsEmbed(stats));
      await this.setToExpire(responseMsg as CommandoMessage);
      return responseMsg;
    } catch (error) {
      if (error instanceof FriendlyError) {
        console.warn(error);
        return msg.reply(`Invalid input. ${error.message}`);
      } else {
        console.error('[StatsCommand] Unexpected error.', error);
      }
    }

    return msg.reply('Failed to calculate stats.');
  }

  parseInput(input: string): ClassLevelNotation[] {
    const re = /(([a-z]+).*?([0-9]+))/ig;
    const matches = [];
    let finished = false;
    while (!finished) {
      const match = re.exec(input);
      if (match) {
        matches.push(match);
      } else {
        finished = true;
      }
    }

    const classes = matches.flatMap(m => {
      const c = getClass(m[2]);
      const l = parseInt(m[3]);
      return c !== undefined && l
        ? { class: c, level: l }
        : [];
    });

    return classes;
  }

  private async setToExpire(msg: CommandoMessage): Promise<void> {
    const provider = this.client.provider as SequelizeProvider;
    const expiry = provider.getForChannel(msg.channel, `expire-${this.name}`) ?? provider.get(msg.guild, 'expire-all');
    if (expiry && typeof expiry === 'number') await MessageExpiryModel.setExpiry(msg, new Date(Date.now() + expiry));
  }
}
