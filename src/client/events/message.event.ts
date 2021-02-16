import { Message } from 'discord.js';

export const handleMessageEvent = async (msg: Message): Promise<void> => {
  if (msg.content === '!' && Math.random() > 0.5) msg.react('😠');
};
