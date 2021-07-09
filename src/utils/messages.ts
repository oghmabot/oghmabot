import { EmojiIdentifierResolvable, MessageReaction } from 'discord.js';
import { CommandoMessage } from 'discord.js-commando';

export const setNegativeReaction = async (msg: CommandoMessage): Promise<MessageReaction> => setSingleReaction(msg, '❌');
export const setPositiveReaction = async (msg: CommandoMessage): Promise<MessageReaction> => setSingleReaction(msg, '✅');

export const setSingleReaction = async (msg: CommandoMessage, reaction: EmojiIdentifierResolvable): Promise<MessageReaction> => {
  const { client, reactions } = msg;
  reactions.cache.each(r => client.user && r.users.remove(client.user));
  return msg.react(reaction);
};
