import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { Stats } from '../../data/models';
import { OghmabotEmbed } from './oghmabot.embed';

export class StatsEmbed extends OghmabotEmbed {
  private stats;

  constructor(stats: Stats[], data?: MessageEmbed | MessageEmbedOptions) {
    super(data);
    this.stats = stats;
    this.listStats();
  }

  private listStats() {
    const description = this.stats.map((stats, i) => {
      const { bab, fortitude, reflex, will } = stats;
      return `**BAB** ${bab}; **Fort** ${fortitude}; **Ref** ${reflex}; **Will** ${will}`;
    }).join('\n');
    this.setDescription(description);
  }
}
