import { Guild } from 'discord.js';
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

    const settings = (await SettingModel.findAll()).map(s => s.get());
    for (const setting of settings) {
      console.log(setting.settings);
    }

    this.setEventListeners();
  }

  public clear(guild: string | Guild): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public destroy(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public get(guild: string | Guild, key: string, defVal?: any) {
    throw new Error('Method not implemented.');
  }

  public set(guild: string | Guild, key: string, val: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public remove(guild: string | Guild, key: string): Promise<any> {
    throw new Error('Method not implemented.');
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

  private setupGuild(guild: string, settings: Settings) {
    if (typeof guild !== 'string') throw new TypeError('The guild must be a guild ID or "global".');
    if (typeof settings.prefix !== 'undefined') return;

    const foundGuild = this.client.guilds.cache.get(guild) as CommandoGuild | undefined;
    const prefix = settings.prefix;

    // Load the command prefix
    if (prefix) {
      if (foundGuild) foundGuild.commandPrefix = settings.prefix;
      else this.client.commandPrefix = settings.prefix;
    }

    // Load all command/group statuses
    for (const command of this.client.registry.commands.values()) this.setupGuildCommand(guild, command, settings);
    for (const group of this.client.registry.groups.values()) this.setupGuildGroup(guild, group, settings);
  }

  private setupGuildCommand(guild: CommandoGuild | string, command: Command, settings: Settings) {
    if (typeof settings[`cmd-${command.name}`] === 'undefined') return;

    const foundGuild = (typeof guild === 'string' ? this.client.guilds.cache.get(guild) : guild) as CommandoGuild | undefined;
    const enabled = !!settings[`cmd-${command.name}`];

    if (foundGuild) {
      foundGuild.setCommandEnabled(command.name, enabled);
    } else {
      command.setEnabledIn('global', enabled);
    }
  }

  private setupGuildGroup(guild: Guild | string, group: CommandGroup, settings: Settings) {
    if (typeof settings[`grp-${group.id}`] === 'undefined') return;

    const foundGuild = (typeof guild === 'string' ? this.client.guilds.cache.get(guild) : guild) as CommandoGuild | undefined;
    const enabled = !!settings[`grp-${group.id}`];

    if (foundGuild) {
      foundGuild.setGroupEnabled(group, enabled);
    } else {
      group.setEnabledIn('global', enabled);
    }
  }
}
