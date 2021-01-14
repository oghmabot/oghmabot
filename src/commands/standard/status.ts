import { Channel, MessageEmbed } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import { Arelith } from '../../assets';
import { Server, ServerProxy } from '../../db';

export class StatusCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'status',
      group: 'arelith',
      memberName: 'status',
      description: 'Replies with the current status of Arelith servers. A server may be specified.',
      args: [
        {
          key: 'options',
          type: 'string',
          prompt: 'Set Oghmabot to announce statuses here?',
          default: '',
        },
      ],
    });
  }

  async run(msg: CommandoMessage, { options }: { options: string }): Promise<any> {
    const {
      here,
      requestedServers,
    } = await this.processOptions(this.preProcessOptions(options));

    if (here) {
      this.setStatusUpdates(msg.channel);
      return msg.say('Server status updates will be updated here.');
    } else if (requestedServers) {
      const { fetchServerStatus } = Arelith.status;
      requestedServers.forEach(async (server: any) => {
        const status = await fetchServerStatus(server);
        await msg.embed(this.createStatusEmbed(server, status));
      });
    }
  }

  preProcessOptions(options: string): string[] {
    return options.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').split(' ');
  }

  async processOptions(options: string[]): Promise<{ here: boolean; requestedServers: Server[] }> {
    return {
      here: options.includes('here'),
      requestedServers: await this.resolveRequestedServers(options),
    };
  }

  async setStatusUpdates(channel: Channel) {
    console.warn('setStatusUpdates not implemented', channel);
  }

  async resolveRequestedServers(input: string[]): Promise<Server[]> {
    const servers = await ServerProxy.getServers();
    return servers.filter(server => {
      return server.alias?.filter(abbr => input.includes(abbr)).length;
    }) || servers;
  }

  createStatusEmbed(server: Server, status: any): MessageEmbed {
    const { serverStateToEmbed } = Arelith.status;
    return serverStateToEmbed(server, status);
  }
}
