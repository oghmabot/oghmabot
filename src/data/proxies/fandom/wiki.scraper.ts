import { trimPunctuationAndWhitespace } from "../../../utils";
import { BaseScraper } from "../../common";
import { Deity } from "../../models";

export class FandomWikiScraper extends BaseScraper {
  static async fetchAndMapDeityArticles(deity: Partial<Deity>): Promise<Partial<Deity>> {
    const { fandomFRUrl, fandomFRCormyrUrl } = deity;
    const fandomTitles = fandomFRUrl ? await this.fetchDeityTitles(fandomFRUrl) : undefined;
    const dogma = fandomFRCormyrUrl ? await this.fetchDeityDogma(fandomFRCormyrUrl) : undefined;
    return { fandomTitles, dogma };
  }

  private static async fetchDeityTitles(url: string): Promise<string[] | undefined> {
    try {
      const $ = await this.fetchAsCheerioRoot(url);
      const titlesElement = $('div.pi-item.pi-data').filter((i, d) => $(d).attr('data-source') === 'title').find('div.pi-data-value')[0] as cheerio.TagElement;
      const titles = titlesElement?.childNodes?.flatMap(node =>
        node.type === 'text' && node.data && trimPunctuationAndWhitespace(node.data)
          ? trimPunctuationAndWhitespace(node.data)
          : [],
      );

      return titles;
    } catch (error) {
      console.error(`[FandomWikiScraper] Unexpected error while fetching deity titles from ${url}.`, error);
    }
  }

  private static async fetchDeityDogma(url: string): Promise<string | undefined> {
    try {
      const $ = await this.fetchAsCheerioRoot(url);
      return $('span#Dogma').parent().next('p').text().trim();
    } catch (error) {
      console.error(`[FandomWikiScraper] Unexpected error while fetching deity dogma from ${url}.`, error);
    }
  }
}
