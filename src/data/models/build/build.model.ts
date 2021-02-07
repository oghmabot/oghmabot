import { DataTypes, Model, Sequelize } from 'sequelize';
import { ArelithWikiScraper } from '../../proxies';

export interface Build {
  name: string;
  url?: string;
  race?: string;
  classes: string[];
  author?: string;
  description?: string;
  vetted?: boolean;
}

export class BuildModel extends Model<Build> {
  static initialize(sequelize: Sequelize): BuildModel {
    return this.init({
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: DataTypes.STRING,
      race: DataTypes.STRING,
      classes: DataTypes.ARRAY(DataTypes.STRING),
      author: DataTypes.STRING,
      description: DataTypes.TEXT,
      vetted: DataTypes.BOOLEAN,
    }, {
      sequelize,
      modelName: 'build',
    });
  }

  static async reset(sequelize: Sequelize, force: boolean = true): Promise<void> {
    try {
      const builds = await ArelithWikiScraper.fetchAllCharacterBuilds();
      if (!builds.length) throw new Error('No builds found.');

      BuildModel.initialize(sequelize);
      await BuildModel.sync({ force });
      builds.forEach(BuildModel.add);
    } catch (error) {
      console.error('[BuildModel] Unexpected error while resetting.', error);
      throw error;
    }
  }

  static add = async (build: Build): Promise<BuildModel> => await BuildModel.create(build);

  static async fetchAll(query?: string): Promise<Build[]> {
    const builds = (await BuildModel.findAll()).map(b => b.get());
    return query
      ? builds.filter(build => this.isMatch(build, query))
      : builds;
  }

  private static isMatch(build: Build, query: string): boolean {
    const { name, race, classes, author, description } = build;
    const buildStr = [name, race, ...classes, author, description].filter(Boolean).join(' ').toLowerCase();
    for (const q of query.toLowerCase().trim().split(' ')) if (!buildStr.includes(q)) return false;
    return true;
  }
}
