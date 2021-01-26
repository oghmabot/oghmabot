import { BaseScraper } from '../../common';

export class ArelithForumScraper extends BaseScraper {
  static async fetchAnnouncements(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  static async fetchUpdates(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
