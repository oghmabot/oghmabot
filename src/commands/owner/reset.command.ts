import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { initialize } from '../../data';
import { stripCommandNotation } from '../../utils';

export class ResetCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'reset',
      group: 'owner',
      memberName: 'reset',
      description: 'Reset database resources.',
      ownerOnly: true,
      args: [
        {
          key: 'db',
          prompt: 'Which database would you like to reset?',
          type: 'string',
          oneOf: ['all', 'builds', 'deities', 'messageExpiries', 'servers', 'subscriptions'],
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
        return msg.say('Databases reset.');
      }

      await initialize(force, db);
      return msg.say('Database reset.');
    } catch (error) {
      console.error(error);
    }

    return msg.say('Resetting database failed.');
  }
}
