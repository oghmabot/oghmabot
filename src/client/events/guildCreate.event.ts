import { Guild } from 'discord.js';

export const handleGuildCreate = async (guild: Guild): Promise<void> => {
  console.log(`Joined new guild ${guild.name}, ${guild.memberCount} members.`);
};
