import { MessageEmbed, MessageEmbedOptions } from 'discord.js';

export class OghmabotEmbed extends MessageEmbed {
  constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data);
    this.setTimestamp();

    const { OGHMABOT_ICON_URL } = process.env;
    if (OGHMABOT_ICON_URL) this.setFooter('Oghmabot', OGHMABOT_ICON_URL);
  }
}
