import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { initialize } from '../../data';
import { stripCommandNotation } from '../../utils';

export class InitializeCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'initialize',
      group: 'owner',
      memberName: 'initialize',
      description: 'Initialize resources.',
      ownerOnly: true,
      args: [
        {
          key: 'db',
          prompt: 'Which database would you like to initialize?',
          type: 'string',
          oneOf: ['all', 'deities', 'servers', 'subscriptions'],
          parse: stripCommandNotation,
        },
        {
          key: 'force',
          prompt: 'N/A',
          type: 'boolean',
          default: false,
        },
      ],
    });
  }

  async run(msg: CommandoMessage, { db, force }: { db: string, force: boolean }): Promise<CommandoMessage> {
    try {
      if (db === 'all') {
        await initialize(force);
        return msg.say('Databases initialized.');
      }

      await initialize(force, db);
      return msg.say('Database initialized.');
    } catch (error) {
      console.error(error);
    }

    return msg.say('Initializing database failed.');
  }
}
