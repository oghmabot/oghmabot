import { Message } from 'discord.js';
import { Command, CommandoMessage } from 'discord.js-commando';
import { OghmabotClient } from '../../client';
import { stripCommandNotation } from '../../utils';

export class ExpireCommand extends Command {
  private expirables = ['all', 'none', 'build', 'deity', 'roll', 'stats', 'status'];

  constructor(client: OghmabotClient) {
    super(client, {
      name: 'expire',
      aliases: ['expiry'],
      group: 'commands',
      memberName: 'expire',
      description: 'Sets bot responses to expire.',
      details: 'The first argument must be the name of a command. Only users with permission to manage messages may use this command.',
      userPermissions: ['MANAGE_MESSAGES'],
      guildOnly: true,
      args: [
        {
          key: 'cmd',
          label: 'command',
          prompt: 'Which command would you set to have expiring responses?',
          type: 'string',
          parse: stripCommandNotation,
          validate: (inp: string) => this.expirables.includes(inp.toLowerCase()),
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

  async run(msg: CommandoMessage, { cmd, min }: { cmd: string, min: number }): Promise<Message | null> {
    cmd = cmd.toLowerCase();
    try {
      if (cmd === 'none') {
        for (const expirable of this.expirables) await this.client.provider.remove(msg.guild, `expire-${expirable}`);
        return msg.reply('Removed all expiry rules.');
      }

      await this.client.provider.set(msg.guild, `expire-${cmd}`, min * 60000);
      return msg.reply(`Set ${'`' + cmd + '`'} responses to expire after ${min} minute${min != 1 ? 's' : ''}.`);
    } catch (error) {
      console.error('[ExpireCommand] Unexpected error.', error);
    }

    return null;
  }
}
