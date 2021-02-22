import { Message } from 'discord.js';
import { Command, CommandGroup, CommandoMessage } from 'discord.js-commando';
import { OghmabotClient } from '../../client';
import { stripCommandNotation } from '../../utils';

export class ExpireCommand extends Command {
  constructor(client: OghmabotClient) {
    super(client, {
      name: 'expire',
      aliases: ['expiry'],
      group: 'commands',
      memberName: 'expire',
      description: 'Sets bot responses to expire.',
      details: 'The first argument must be the name of a command or command group. Only users with permission to manage messages may use this command.',
      userPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          key: 'cmdOrGrp',
          label: 'command/group',
          prompt: 'Which command or command group would you set to have expiring responses?',
          type: 'group|command',
          parse: stripCommandNotation,
        },
        {
          key: 'min',
          prompt: 'How many minutes should the bot\'s responses show for?',
          type: 'integer',
          default: '10',
        },
      ],
      examples: [
        '-expire deity',
        '-expire status 1',
      ],
    });
  }

  async run(msg: CommandoMessage, { cmdOrGrp, min }: { cmdOrGrp: Command | CommandGroup, min: number }): Promise<Message> {
    try {
      await this.client.provider.set(msg.guild, `expire-${cmdOrGrp}`, min * 60000);
      return msg.reply(`Set ${'`' + cmdOrGrp + '`'} responses to expire after ${min} minute${min != 1 ? 's' : ''}.`);
    } catch (error) {
      console.error('[ExpireCommand] Unexpected error.', error);
    }
    console.log(cmdOrGrp);
    return msg;
  }
}
