import { Collection, Message, TextChannel } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { stripCommandNotation } from '../../utils';

export class CleanupCommand extends Command {
  private channelKeywords = ['here', 'this']
  private responseTypes = ['all', 'build', 'deity', 'roll', 'stats', 'status']

  constructor(client: CommandoClient) {
    super(client, {
      name: 'cleanup',
      aliases: ['clean'],
      group: 'commands',
      memberName: 'cleanup',
      description: 'Instructs the bot to delete its own messages.',
      details: '',
      userPermissions: ['MANAGE_MESSAGES'],
      guildOnly: true,
      args: [
        {
          key: 'channel',
          label: 'channel',
          prompt: 'In which channel should the bot cleanup its messages?',
          type: 'string',
          parse: stripCommandNotation,
          validate: (inp: string) => this.channelKeywords.includes(inp.toLowerCase()) || this.client.channels.cache.has(inp),
        },
        {
          key: 'types',
          label: 'response types',
          prompt: 'Which bot responses should be deleted?',
          type: 'string',
          parse: stripCommandNotation,
          validate: (inp: string) => inp.split(',').reduce((valid, str) => valid || this.responseTypes.includes(str), false),
        },
      ],
      examples: [
        '-cleanup here deity',
      ],
    });
  }

  async run(msg: CommandoMessage, { channel, types }: { channel: string, types: string }): Promise<Message | null> {
    try {
      const channels = this.getChannels(msg, channel.toLowerCase());
      if (channels) {
        const { author } = msg;
        for (const channel of channels) {
          const channelMember = channel.members.get(author.id);
          const hasPermission = channelMember?.hasPermission('MANAGE_MESSAGES', { checkAdmin: true, checkOwner: true });
          if (hasPermission) {
            const messages = await this.getBotMessages(channel, this.parseTypes(types));
            // for (const message of messages) await message.delete();
            for (const message of messages) console.log(message);
          }
        }
      }
    } catch (error) {
      console.error('[CleanupCommand] Unexpected error.', error);
    }

    return null;
  }

  private getChannels(msg: CommandoMessage, inp: string): TextChannel[] | undefined {
    if (inp === 'guild' || inp === 'server') {
      // This is currently not in use
      return this.client.guilds.cache.get(msg.guild.id)?.channels.cache.array().filter(c => c.type === 'text') as TextChannel[];
    } else if (inp === 'here' || inp === 'this') {
      return [this.client.channels.resolve(msg.channel) as TextChannel];
      return [msg.channel as TextChannel];
    } else {
      const channel = this.client.channels.resolve(inp);
      if (channel) return [channel as TextChannel];
    }
  }

  private async getBotMessages(channel: TextChannel, types: string[]): Promise<Message[]> {
    // const allMessages = await channel.awaitMessages(m => (m as CommandoMessage).isCommand || m.author.id === this.client.user?.id) as Collection<string, CommandoMessage>;
    const allMessages = await channel.messages.fetch({ limit: 10 }) as Collection<string, CommandoMessage>;
    const cmdMessages = allMessages.filter(m => m.isCommand);
    const botMessages = allMessages.filter(m => m.author.id === this.client.user?.id && !m.deleted && m.deletable);
    if (!types.length || types.includes('all')) {
      return botMessages.array();
    } else {
      return types.flatMap(type => {
        return cmdMessages.array().filter(m => m.isCommand).flatMap(cmdMsg => {
          console.log(cmdMsg.command?.name);
          const { responses } = cmdMsg;
          return responses
            ? responses[channel.id]
            : [];
        });
      });
    }
  }

  private parseTypes(inp: string): string[] {
    const types = inp.toLowerCase().split(',').filter(t => this.responseTypes.includes(t));
    return types.includes('all')
      ? ['all']
      : types;
  }
}
