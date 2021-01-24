import HTMLElementData from "beautiful-dom/dist/htmlelement";
import { findBestStringMatch } from "../../../utils/parsing";
import { Deity } from "../../models";
import { BaseScraper } from "../../common";

const WikiUrl = 'http://wiki.arelith.com';
const DeityTableUrl = 'http://wiki.arelith.com/Deity_Table';

export class ArelithWikiScraper extends BaseScraper {
  static async fetchDeity(deityQuery: string): Promise<Deity | undefined> {
    const deityListings = await this.getDeityTableRows();
    const tableRow = findBestStringMatch(deityListings, deityQuery, r => r.querySelector('a')?.textContent);

    if (tableRow) return await this.mapDeityTableRowToDeity(tableRow);

    return this.handleAlternativeWorship(deityQuery);
  }

  static async fetchAllDeities(): Promise<Deity[]> {
    const rows = await this.getDeityTableRows();
    return Promise.all(rows.map(ArelithWikiScraper.mapDeityTableRowToDeity));
  }

  private static async getDeityTableRows(): Promise<HTMLElementData[]> {
    const dom = await this.fetchAsBeautifulDom(DeityTableUrl);
    return dom.querySelectorAll('table')[1]?.querySelectorAll('tbody tr').filter(r => !r.querySelectorAll('td')[5]?.textContent.trim().toLowerCase().includes('heresies'));
  }

  private static async mapDeityTableRowToDeity(row: HTMLElementData): Promise<Deity> {
    const url = row.querySelector('a')?.getAttribute('href');
    const [
      name,
      alignment,
      arelithClergyAlignments,
      aspect1,
      aspect2,
      arelithCategory,
    ] = row.querySelectorAll('td');

    const deity = {
      arelithWikiUrl: url ? `${WikiUrl}${url}` : undefined,
      name: name?.textContent.trim(),
      alignment: alignment?.textContent.trim(),
      clergyAlignments: arelithClergyAlignments?.textContent.trim().split(' ').filter(Boolean),
      arelithAspects: [aspect1?.textContent.trim(), aspect2?.textContent.trim()].filter(Boolean),
      arelithClergyAlignments: arelithClergyAlignments?.textContent.trim().split(' ').filter(Boolean),
      arelithCategory: arelithCategory?.textContent.trim(),
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

    return {
      ...deity,
      titles: dom.querySelector('dl dd i')?.textContent.split(',').map(t => t.trim()).filter(Boolean),
      powerLevel: powerLevel?.querySelectorAll('td')[1]?.textContent.trim(),
      symbol: symbol?.querySelectorAll('td')[1]?.textContent.trim(),
      alignment: alignment?.querySelectorAll('td')[1]?.textContent.trim(),
      portfolio: portfolio?.querySelectorAll('td')[1]?.textContent.split(',').map(p => p.trim()).filter(Boolean),
      worshippers: worshippers?.querySelectorAll('td')[1]?.textContent.split(',').map(p => p.trim()).filter(Boolean),
      domains: domains?.querySelectorAll('td')[1]?.textContent.replace(/ *\[[^\]]*]/g, '').split(',').map(d => d.trim()).filter(Boolean),
      arelithClergyAlignments: arelithClergyAlignments?.querySelectorAll('td')[1]?.textContent.split(',').map(a => a.trim()).filter(Boolean),
    };
  }

  private static async handleAlternativeWorship(deityQuery: string): Promise<Deity | undefined> {
    if (findBestStringMatch(['abeir-toril', 'toril', 'nature', 'beasts'], deityQuery)) {
      const deity = {
        name: 'Abeir-Toril',
        alignment: 'No Alignment',
        arelithWikiUrl: `${WikiUrl}/Toril`,
        arelithAspects: ['Nature', 'Magic'],
        thumbnail: 'https://vignette.wikia.nocookie.net/forgottenrealms/images/7/71/Toril-globe-small.jpg',
      };

      return await this.fetchAndMapDeityPage(deity);
    }
  }
}
