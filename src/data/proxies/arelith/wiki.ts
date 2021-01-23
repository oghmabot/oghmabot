import HTMLElementData from "beautiful-dom/dist/htmlelement";
import { findBestStringMatch } from "../../../utils/parsing";
import { Deity } from "../../models";
import { BaseScraper } from "../../common";

const WikiUrl = 'http://wiki.arelith.com';
const DeityTableUrl = 'http://wiki.arelith.com/Deity_Table';

export class ArelithWikiScraper extends BaseScraper {
  static async fetchDeity(deityQuery: string): Promise<Deity | undefined> {
    const dom = await this.fetchAsBeautifulDom(DeityTableUrl);
    const tableRow = findBestStringMatch(
      dom.querySelectorAll('tbody tr').filter(r => !r.querySelectorAll('td')[5]?.textContent.trim().toLowerCase().includes('heresies')),
      deityQuery.toLowerCase().replace(/\s+/g, ''),
      r => r.querySelector('a')?.textContent.toLowerCase().replace(/\s+/g, ''),
    );

    if (tableRow) return await this.mapDeityTableRowToDeity(tableRow);

    return this.handleAlternativeWorship(deityQuery);
  }

  static async fetchAllDeities(): Promise<Deity[]> {
    const dom = await this.fetchAsBeautifulDom(DeityTableUrl);
    return Promise.all(dom.querySelectorAll('tbody tr').map(this.mapDeityTableRowToDeity));
  }

  private static async mapDeityTableRowToDeity(row: HTMLElementData): Promise<Deity> {
    const arelithWikiUrl = `${WikiUrl}${row.querySelector('a')?.getAttribute('href')}`;
    const [
      name,
      alignment,
      arelithClergyAlignments,
      aspect1,
      aspect2,
      arelithCategory,
    ] = row.querySelectorAll('td');

    const deity = {
      arelithWikiUrl: arelithWikiUrl,
      name: name?.textContent.trim(),
      alignment: alignment?.textContent.trim(),
      clergyAlignments: arelithClergyAlignments?.textContent.trim().split(' ').filter(Boolean),
      arelithAspects: [aspect1?.textContent.trim(), aspect2?.textContent.trim()].filter(Boolean),
      arelithClergyAlignments: arelithClergyAlignments?.textContent.trim().split(' ').filter(Boolean),
      arelithCategory: arelithCategory?.textContent.trim(),
    };

    return await this.fetchAndMapDeityPage(deity);
  }

  private static async fetchAndMapDeityPage(deity: Deity): Promise<Deity> {
    const dom = await this.fetchAsBeautifulDom(`${deity.arelithWikiUrl}`);
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
