import { Channel } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import { Arelith } from '../../assets';
import { Server } from '../../db';

export class Status extends Command {
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

    if(here) {
      this.setStatusUpdates(msg.channel);
      return msg.say('Server status updates will be updated here.');
    } else if(requestedServers) {
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

  async processOptions(options: string[]) {
    return {
      here: options.includes('here'),
      requestedServers: await this.resolveRequestedServers(options),
    };
  }

  async setStatusUpdates(channel: Channel) {
    console.warn('setStatusUpdates not implemented', channel);
  }

  async resolveRequestedServers(input: string[]) {
    const servers = await Server.getServers();
    return servers.filter((server: { abbreviations: { filter: (arg0: (abbr: any) => boolean) => { (): any; new(): any; length: any; }; }; }) => {
      return server.abbreviations.filter(abbr => input.includes(abbr)).length;
    }) || servers;
  }

  createStatusEmbed(server: any, status: any) {
    const { serverStateToEmbed } = Arelith.status;
    return serverStateToEmbed(server, status);
  }
};