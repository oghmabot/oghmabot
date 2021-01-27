import { Message, PartialMessage } from 'discord.js';
import { purgeRefsToMessage } from '../../data/models';

export const handleMessageDelete = async (msg: Message | PartialMessage): Promise<void> => {
  const count = await purgeRefsToMessage(msg.id);
  console.log(`Message deleted, purged ${count} database rows.`);
};
