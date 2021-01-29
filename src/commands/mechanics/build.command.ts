import { CharacterBuild } from '../../data/models';
import { ArelithWikiScraper } from '../../data/proxies';
import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { findBestStringMatch, stripCommandNotation } from '../../utils';
import { BuildEmbed } from '../../client/embeds/build.embed';

export class BuildCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'build',
      group: 'mechanics',
      memberName: 'build',
      description: 'Replies with links relevant character builds.',
      details: 'The command returns builds found on the Arelith Wiki\'s Character Builds page.',
      aliases: ['builds'],
      args: [
        {
          key: 'query',
          type: 'string',
          prompt: 'What build should I search for?',
          parse: stripCommandNotation,
        },
      ],
      examples: [
        '-build ranger',
        '-build kenji',
        '-build firbolg druid',
      ],
    });
  }

  async run(msg: CommandoMessage, { query }: { query: string }): Promise<Message> {
    try {
      const builds = await this.fetchBuilds(query);
      const foundBuilds = this.sortBuildsByQueryMatch(builds, query);
      return msg.reply(new BuildEmbed(foundBuilds.slice(0, 5)));
    } catch (error) {
      console.error('[BuildCommand] Unexpected error.', error);
    }

    return msg.reply('No relevant builds were found.');
  }

  private sortBuildsByQueryMatch(builds: CharacterBuild[], query: string): CharacterBuild[] {
    return builds.sort((a, b) => this.buildIsMatch(b, query.trim()) - this.buildIsMatch(a, query.trim()));
  }

  private buildIsMatch(build: CharacterBuild, query: string): number {
    const { name, race, classes, author, description } = build;
    const stringsToMatch = [name, race, ...classes, author, description].filter(Boolean) as string[];
    return query.split(' ').reduce((matches, q) => {
      return findBestStringMatch(stringsToMatch, q) ? matches + 1 : matches;
    }, 0);
  }

  private async fetchBuilds(query?: string): Promise<CharacterBuild[]> {
    const builds = await ArelithWikiScraper.fetchAllCharacterBuilds();
    return query
      ? builds.filter(b => this.buildIsMatch(b, query.trim()))
      : builds;
  }
}
