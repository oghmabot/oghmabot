import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import { Server, ServerModel } from "../../data";
import { fetchServer, isValidBeamdogIdentifier } from "../../data/proxy/beamdog";

interface AddCommandArguments {
  descriptor: string;
  identifier: string;
  alias: string;
  href: string;
  img: string;
}

export class AddCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'add',
      group: 'owner',
      memberName: 'add',
      description: 'Add server to servers database.',
      ownerOnly: true,
      args: [
        {
          key: 'descriptor',
          prompt: 'What would you like to add?',
          type: 'string',
          default: 'server',
          validate: (text: string) => text == 'server',
        },
        {
          key: 'identifier',
          prompt: `Please supply a valid identifier for querying Beamdog's NWN API.`,
          type: 'string',
          parse: (str: string) => str.trim(),
          validate: isValidBeamdogIdentifier,
        },
        {
          key: 'alias',
          prompt: 'Specify aliases for the server to be added.',
          type: 'string',
        },
        {
          key: 'href',
          prompt: 'Specify link for the outputted server status.',
          type: 'string',
        },
        {
          key: 'img',
          prompt: 'Specify image source (url) for the outputted server status.',
          type: 'string',
        }
      ]
    });
  }

  async run(msg: CommandoMessage,{ descriptor, identifier, alias, href, img }: AddCommandArguments): Promise<any> {
    if (descriptor === 'server') {
      try {
        const server = {
          ...ServerModel.fromBeamdogAPIResponse(await fetchServer(identifier)),
          alias: alias.split(' '),
          href,
          img,
        };
        await ServerModel.addServer(server);
        return msg.reply(this.formatServerAddedReply(server));
      } catch (err) {
        console.warn(err.message);
        return msg.say('Invalid identifier.');
      }
    }

    return msg.say('Invalid input.');
  }

  formatServerAddedReply = (server: Server): string => (
    'The following server has been added.'
    + '```'
    + `ID: ${server.id}`
    + `NAME: ${server.name}`
    + `IP: ${server.ip}`
    + `PORT: ${server.port}`
    + `ALIAS: ${server.alias}`
    + `HREF: ${server.href}`
    + `IMG: ${server.img}`
    + '```'
  );
}
