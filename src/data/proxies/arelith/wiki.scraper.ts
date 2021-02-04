import HTMLElementData from 'beautiful-dom/dist/htmlelement';
import { findBestStringMatch, stripParenthesis } from '../../../utils/parsing';
import { Alignment, getAlignment, Deity, Build } from '../../models';
import { BaseScraper } from '../../common';
import { DeityCategory, getDeityCategory } from '../../models/deity/category.model';
import BeautifulDom from 'beautiful-dom';

export class ArelithWikiScraper extends BaseScraper {
  static async fetchAllCharacterBuilds(): Promise<Build[]> {
    const { ARELITH_WIKI_URL } = process.env;
    const dom = await this.fetchAsBeautifulDom(`${ARELITH_WIKI_URL}/Character_Builds`);
    return Promise.all(dom.querySelectorAll('table')[1]?.querySelectorAll('tbody tr').map(this.mapCharacterBuildsTableRowToCharacterBuild));
  }

  static async mapCharacterBuildsTableRowToCharacterBuild(row: HTMLElementData): Promise<Build> {
    const url = row.querySelector('a')?.getAttribute('href');
    const [name, race, class1, class2, class3, author, description, vetted] = row.querySelectorAll('td').map(td => td?.textContent.trim());
    return {
      name,
      url: url ?? undefined,
      race,
      classes: [class1, class2, class3].filter(Boolean),
      author,
      description,
      vetted: vetted?.toLowerCase().includes('yes'),
    };
  }

  /**
   * This method is used to scrape a specific deity.
   * @param deityQuery string that can resolve to a deity name
   */
  static async fetchDeity(deityQuery: string): Promise<Deity | undefined> {
    const deityListings = await this.getDeityTableRows();
    const tableRow = findBestStringMatch(deityListings, deityQuery, r => stripParenthesis(r.querySelector('a')?.textContent || ''));

    if (tableRow) return await this.mapDeityTableRowToDeity(tableRow);

    return this.handleAlternativeWorship(deityQuery);
  }

  static async fetchAllDeities(): Promise<Deity[]> {
    const rows = await this.getDeityTableRows();
    const deities = await Promise.all(rows.map(ArelithWikiScraper.mapDeityTableRowToDeity));
    return deities.filter(d => d.name);
  }

  private static async getDeityTableRows(): Promise<HTMLElementData[]> {
    const { ARELITH_WIKI_URL } = process.env;
    const dom = await this.fetchAsBeautifulDom(`${ARELITH_WIKI_URL}/Deity_Table`);
    return dom.querySelectorAll('table')[1]?.querySelectorAll('tbody tr').filter(r => !r.querySelector('a')?.textContent.toLowerCase().includes('abyssal'));
  }

  private static async mapDeityTableRowToDeity(row: HTMLElementData): Promise<Deity> {
    const { ARELITH_WIKI_URL } = process.env;
    const url = row.querySelector('a')?.getAttribute('href');
    const [
      name,
      alignment,
      arelithClergyAlignments,
      aspect1,
      aspect2,
      arelithCategory,
    ] = row.querySelectorAll('td');
    const categories = arelithCategory?.querySelectorAll('a') ?? ['Other'];

    const deity = {
      arelithWikiUrl: url ? `${ARELITH_WIKI_URL}${url}` : undefined,
      name: name?.textContent.trim(),
      alignment: getAlignment(alignment?.textContent.trim()),
      clergyAlignments: arelithClergyAlignments?.textContent.trim().split(' ').map(a => getAlignment(a.trim())).filter(Boolean) as Alignment[] | undefined,
      arelithAspects: [aspect1?.textContent.trim(), aspect2?.textContent.trim()].filter(Boolean),
      arelithClergyAlignments: arelithClergyAlignments?.textContent.trim().split(' ').map(a => getAlignment(a.trim())).filter(Boolean) as Alignment[] | undefined,
      arelithCategory: categories.reduce((previous, cur) => getDeityCategory(cur.textContent) > previous ? getDeityCategory(cur.textContent) : previous, 0),
    };

    return await ArelithWikiScraper.fetchAndMapDeityPage(deity);
  }

  private static async fetchAndMapDeityPage(deity: Deity): Promise<Deity> {
    const { arelithWikiUrl } = deity;
    if (!arelithWikiUrl) return deity;

    const dom = await this.fetchAsBeautifulDom(`${arelithWikiUrl}`);
    const [
      powerLevel,
      symbol,
      alignment,
      portfolio,
      worshippers,
      domains,
      arelithClergyAlignments,
    ] = dom.querySelectorAll('tbody tr');

    const result = {
      ...deity,
      titles: dom.querySelector('dl dd i')?.textContent.split(',').map(t => t.trim()).filter(Boolean),
      powerLevel: powerLevel?.querySelectorAll('td')[1]?.textContent.trim(),
      symbol: symbol?.querySelectorAll('td')[1]?.textContent.trim(),
      alignment: getAlignment(alignment?.querySelectorAll('td')[1]?.textContent.trim()),
      portfolio: portfolio?.querySelectorAll('td')[1]?.textContent.split(',').map(p => p.trim()).filter(Boolean),
      worshippers: worshippers?.querySelectorAll('td')[1]?.textContent.split(',').map(p => p.trim()).filter(Boolean),
      domains: domains?.querySelectorAll('td')[1]?.textContent.replace(/ *\[[^\]]*]/g, '').split(',').map(d => d.trim()).filter(Boolean),
      arelithClergyAlignments: arelithClergyAlignments?.querySelectorAll('td')[1]?.textContent.split(',').map(a => getAlignment(a.trim())).filter(Boolean) as Alignment[] | undefined,
    };

    return deity.arelithCategory === DeityCategory.Heresy
      ? { ...result, ...this.findSynergies(dom) }
      : result;
  }

  private static findSynergies(dom: BeautifulDom): Partial<Deity> | undefined {
    const tables = dom.querySelectorAll('table');
    if (tables[2]) {
      const synergies = tables[1].querySelector('td')?.textContent.split(',').map(s => s.trim());
      return {
        synergies,
      };
    }
  }

  private static async handleAlternativeWorship(deityQuery: string): Promise<Deity | undefined> {
    if (findBestStringMatch(['abeir-toril', 'toril', 'nature', 'beasts'], deityQuery)) {
      const { ARELITH_WIKI_URL } = process.env;
      const deity = {
        name: 'Abeir-Toril',
        alignment: Alignment.NA,
        arelithWikiUrl: `${ARELITH_WIKI_URL}/Toril`,
        arelithAspects: ['Nature', 'Magic'],
        thumbnail: 'https://vignette.wikia.nocookie.net/forgottenrealms/images/7/71/Toril-globe-small.jpg',
      };

      return await this.fetchAndMapDeityPage(deity);
    }
  }
}
