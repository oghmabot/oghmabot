import { ArelithWikiScraper } from '../proxies';

export interface Build {
  name: string;
  url?: string;
  race?: string;
  classes: string[];
  author?: string;
  description?: string;
  vetted?: boolean;
}

export class BuildModel {
  static async fetchAll(query?: string): Promise<Build[]> {
    const builds = await ArelithWikiScraper.fetchAllCharacterBuilds();
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
