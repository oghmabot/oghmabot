import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

export class AnnouncementCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'announcement',
      group: 'TODO',
      memberName: 'announcement',
      aliases: ['announcements'],
      description: 'Replies with the latest Arelith forum announcement.',
      args: [
        {
          key: 'countBack',
          type: 'number',
          prompt: 'Specify a number for how many announcements backwards you want to browse to.',
          default: 0,
        },
      ],
    });
  }

  async run(msg: CommandoMessage, { countBack }: { countBack: number }): Promise<Message> {
    throw new Error('Command not implemented.');
  }
}
