import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { Build } from '../../data/models';
import { OghmabotEmbed } from '../oghmabot.embed';

export class BuildEmbed extends OghmabotEmbed {
  private builds;

  constructor(builds: Build[], data?: MessageEmbed | MessageEmbedOptions) {
    super(data);
    this.builds = builds;
    this.listBuilds();
  }

  listBuilds(): void {
    const description = this.builds.map((build, i) => {
      const { name, url, author } = build;
      return `${i + 1}. [${name}](${url}) | ${author}`;
    }).join('\n');
    this.setDescription(description);
  }
}
