import { Message } from "discord.js";
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
          validate: (text: string) => ['server', 'alias', 'href', 'img'].includes(text.toLowerCase()),
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
        },
      ],
    });
  }

  async run(msg: CommandoMessage, args: AddCommandArguments): Promise<any> {
    const { descriptor } = args;
    if (descriptor === 'server') {
      return await this.addServer(msg, args);
    }
  }

  async addServer(addMsg: CommandoMessage, args: AddCommandArguments): Promise<Message | CommandoMessage> {
    const { identifier, alias, href, img } = args;
    const server = {
      ...ServerModel.fromBeamdogAPIResponse(await fetchServer(identifier)),
      alias: alias.split(' '),
      href,
      img,
    };

    try {
      if (await ServerModel.serverExists(server)) {
        return addMsg.reply('Server already exists.');
      }

      await ServerModel.addServer(server);
      return addMsg.reply(this.formatServerAddedReply(server));
    } catch (err) {
      console.error(err);
    }

    return addMsg.reply('Failed to add new server.');
  }

  formatServerAddedReply = (server: Server): string => (
    'Server added.'
    + '\n```'
    + `\nID: ${server.id}`
    + `\nNAME: ${server.name}`
    + `\nIP: ${server.ip}`
    + `\nPORT: ${server.port}`
    + `\nALIAS: ${server.alias}`
    + `\nHREF: ${server.href}`
    + `\nIMG: ${server.img}`
    + '\n```'
  );
}
