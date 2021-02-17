import { EmojiResolvable, MessageReaction } from 'discord.js';
import { CommandoMessage } from 'discord.js-commando';

export const setSingleReaction = async (msg: CommandoMessage, reaction: EmojiResolvable): Promise<MessageReaction> => {
  const { client, reactions } = msg;
  reactions.cache.each(r => client.user && r.users.remove(client.user));
  return msg.react(reaction);
};
