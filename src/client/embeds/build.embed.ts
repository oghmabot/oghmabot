import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { Build } from '../../data/models';
import { OghmabotEmbed } from './oghmabot.embed';

export class BuildEmbed extends OghmabotEmbed {
  private builds;

  constructor(builds: Build[], show: number = 10, data?: MessageEmbed | MessageEmbedOptions) {
    super(data);
    this.builds = builds;
    this.listBuilds(show);
  }

  listBuilds(show: number): void {
    const description = this.builds.slice(0, show).map((build, i) => {
      const { name, url, author } = build;
      return `${i + 1}. [${name}](${url}) | ${author}`;
    }).join('\n');
    this.setDescription(description);
  }
}
