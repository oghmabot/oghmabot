import { Channel, Guild, TextChannel } from 'discord.js';
import { Command, CommandGroup, CommandoClient, CommandoGuild, SettingProvider } from 'discord.js-commando';
import { connect } from '../../data';
import { SettingModel, Settings } from './setting.model';

export class SequelizeProvider extends SettingProvider {
  private client: CommandoClient;
  private listeners;
  private channelSettings;
  private guildSettings;

  constructor(client: CommandoClient) {
    super();
    this.client = client;
    this.listeners = new Map();
    this.channelSettings = new Map();
    this.guildSettings = new Map();
  }

  public async init(): Promise<void> {
    const { DATABASE_URL } = process.env;
    const sequelize = await connect(DATABASE_URL);
    SettingModel.initialize(sequelize);
    await SettingModel.sync();

    const rows = (await SettingModel.findAll()).map(s => s.get());
    for (const setting of rows) {
      const { guildId, channelId, settings } = setting;

      if (channelId) {
        this.channelSettings.set(channelId, settings);
      } else {
        this.guildSettings.set(guildId, settings);
        this.setupGuild(guildId, settings);
      }
    }

    this.setEventListeners();
  }

  //#region clear
  public async clear(guild: string | Guild, channel?: string | Channel): Promise<void> {
    const foundChannel = channel ? this.resolveChannel(channel) : undefined;
    if (foundChannel) {
      await this.clearChannel(foundChannel);
    } else {
      const foundGuild = this.resolveGuild(guild);
      if (foundGuild) {
        await this.clearGuild(foundGuild);
      }
    }
  }

  private async clearChannel(channel: Channel): Promise<void> {
    const { id } = channel;
    if (this.channelSettings.has(id)) {
      this.channelSettings.delete(id);
      await SettingModel.destroy({ where: { channelId: id } });
    }
  }

  private async clearGuild(guild: Guild): Promise<void> {
    const { id } = guild;
    if (this.guildSettings.has(id)) {
      this.guildSettings.delete(id);
      const rows = await SettingModel.getAll({ where: { guildId: id } });
      for (const setting of rows) {
        const { channelId } = setting;
        if (channelId) this.channelSettings.delete(channelId);
      }

      await SettingModel.destroy({ where: { guildId: id } });
    }
  }
  //#endregion clear

  //#region get
  public get(guild: string | Guild, key: string, defVal?: boolean | number | string): boolean | number | string | undefined {
    const foundGuild = this.resolveGuild(guild);
    if (foundGuild && this.guildSettings.has(foundGuild.id)) {
      const settings = this.guildSettings.get(foundGuild.id);
      if (settings && settings[key]) return settings[key];
    }

    return defVal;
  }

  public getForChannel(channel: string | Channel, key: string, defVal?: boolean | number | string): boolean | number | string | undefined {
    const foundChannel = this.resolveChannel(channel);
    if (foundChannel) {
      const { id } = foundChannel;
      if (this.channelSettings.has(id)) {
        const settings = this.channelSettings.get(id);
        if (settings && settings[key]) return settings[key];
      }

      const guild = (foundChannel as TextChannel).guild;
      if (guild && this.guildSettings.has(guild.id)) {
        const settings = this.guildSettings.get(guild.id);
        if (settings && settings[key]) return settings[key];
      }
    }

    return defVal;
  }
  //#endregion get

  //#region set
  public async set(guild: string | Guild, key: string, val: boolean | number | string): Promise<void> {
    const foundGuild = this.resolveGuild(guild);
    if (foundGuild) {
      const { id } = foundGuild;
      if (!this.guildSettings.has(id)) this.guildSettings.set(id, {});

      const settings = this.guildSettings.get(id);
      settings[key] = val;

      await SettingModel.upsert({ guildId: id, settings });
    }
  }

  public async setForChannel(channel: string | Channel, key: string, val: boolean | number | string): Promise<void> {
    const foundChannel = this.resolveChannel(channel) as TextChannel | undefined;
    if (foundChannel) {
      const { id, guild } = foundChannel;
      if (!this.channelSettings.has(id)) this.channelSettings.set(id, {});

      const settings = this.channelSettings.get(id);
      settings[key] = val;

      await SettingModel.upsert({ guildId: guild.id, channelId: id, settings });
    }
  }
  //#endregion set

  //#region remove
  public async remove(guild: string | Guild, key: string): Promise<boolean> {
    const foundGuild = this.resolveGuild(guild);
    if (foundGuild) {
      const { id } = foundGuild;
      if (this.guildSettings.has(id)) {
        const settings = this.guildSettings.get(id);
        if (settings[key] !== undefined) {
          delete settings[key];
          await SettingModel.upsert({ guildId: id, settings });
          return true;
        }
      }
    }

    return false;
  }

  public async removeForChannel(channel: string | Channel, key: string): Promise<boolean> {
    const foundChannel = this.resolveChannel(channel) as TextChannel | undefined;
    if (foundChannel) {
      const { id, guild } = foundChannel;
      if (this.channelSettings.has(id)) {
        const settings = this.channelSettings.get(id);
        if (settings[key] !== undefined) {
          delete settings[key];
          await SettingModel.upsert({ guildId: guild.id, channelId: id, settings });
          return true;
        }
      }
    }

    return false;
  }
  //#endregion remove

  public async destroy(): Promise<void> {
    await SettingModel.destroy();
    this.channelSettings.clear();
    this.guildSettings.clear();
    this.listeners.clear();
  }

  private setEventListeners() {
    this.listeners
      .set('commandPrefixChange', (guild: CommandoGuild, prefix: string) => this.set(guild, 'prefix', prefix))
      .set('commandStatusChange', (guild: CommandoGuild, command: Command, enabled: boolean) => this.set(guild, `cmd-${command.name}`, enabled))
      .set('groupStatusChange', (guild: CommandoGuild, group: CommandGroup, enabled: boolean) => this.set(guild, `grp-${group.id}`, enabled))
      .set('guildCreate', (guild: CommandoGuild) => {
        const settings = this.guildSettings.get(guild.id);
        if (!settings) return;
        this.setupGuild(guild.id, settings);
      })
      .set('commandRegister', (command: Command) => {
        for (const [guild, settings] of this.guildSettings) {
          if (guild !== 'global' && !this.client.guilds.cache.has(guild)) continue;
          this.setupGuildCommand(guild, command, settings);
        }
      })
      .set('groupRegister', (group: CommandGroup) => {
        for (const [guild, settings] of this.guildSettings) {
          if (guild !== 'global' && !this.client.guilds.cache.has(guild)) continue;
          this.setupGuildGroup(guild, group, settings);
        }
      });
    for (const [event, listener] of this.listeners) this.client.on(event, listener);
  }

  private setupGuild(guild: string, settings: Settings): void {
    for (const command of this.client.registry.commands.values()) this.setupGuildCommand(guild, command, settings);
    for (const group of this.client.registry.groups.values()) this.setupGuildGroup(guild, group, settings);
  }

  private setupGuildCommand(guild: CommandoGuild | string, command: Command, settings: Settings): void {
    if (typeof settings[`cmd-${command.name}`] === 'undefined') return;

    const foundGuild = this.resolveGuild(guild) as CommandoGuild | undefined;
    if (foundGuild) foundGuild.setCommandEnabled(command, !!settings[`cmd-${command.name}`]);
  }

  private setupGuildGroup(guild: Guild | string, group: CommandGroup, settings: Settings): void {
    if (typeof settings[`grp-${group.id}`] === 'undefined') return;

    const foundGuild = this.resolveGuild(guild) as CommandoGuild | undefined;
    if (foundGuild) foundGuild.setGroupEnabled(group, !!settings[`grp-${group.id}`]);
  }

  private resolveChannel(channel: string | Channel): Channel | undefined {
    return typeof channel === 'string' ? this.client.channels.cache.get(channel) : channel;
  }

  private resolveGuild(guild: string | Guild): Guild | undefined {
    return typeof guild === 'string' ? this.client.guilds.cache.get(guild) : guild;
  }
}
