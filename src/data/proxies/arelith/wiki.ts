import BeautifulDom from "beautiful-dom";
import HTMLElementData from "beautiful-dom/dist/htmlelement";
import fetch from "node-fetch";
import { findBestStringMatch } from "../../../utils/parsing";
import { Deity } from "../../models";

const WikiUrl = 'http://wiki.arelith.com';
const DeityTableUrl = 'http://wiki.arelith.com/Deity_Table';

const fetchBeautifulDom = async (url: string) => new BeautifulDom(await fetch(url).then(response => response.text()));

const fetchAndMapDeityPage = async (deity: Deity): Promise<Deity> => {
  const dom = await fetchBeautifulDom(`${deity.ar_wiki_url}`);
  const dogma = dom.querySelectorAll('h3').find(h => h.querySelector('span')?.getAttribute('id')?.toLowerCase() === 'dogma');
  const [
    power_level,
    symbol,
    alignment,
    portfolio,
    worshippers,
    domains,
    ar_clergy_alignments,
  ] = dom.querySelectorAll('tbody tr');

  return {
    ...deity,
    titles: dom.querySelector('dl dd i')?.textContent.split(',').map(t => t.trim()).filter(Boolean),
    power_level: power_level?.querySelectorAll('td')[1]?.textContent.trim(),
    symbol: symbol?.querySelectorAll('td')[1]?.textContent.trim(),
    alignment: alignment?.querySelectorAll('td')[1]?.textContent.trim(),
    portfolio: portfolio?.querySelectorAll('td')[1]?.textContent.split(',').map(p => p.trim()).filter(Boolean),
    worshippers: worshippers?.querySelectorAll('td')[1]?.textContent.split(',').map(p => p.trim()).filter(Boolean),
    domains: domains?.querySelectorAll('td')[1]?.textContent.replace(/ *\[[^\]]*]/g, '').split(',').map(d => d.trim()).filter(Boolean),
    ar_clergy_alignments: ar_clergy_alignments?.querySelectorAll('td')[1]?.textContent.split(',').map(a => a.trim()).filter(Boolean),
  };
};

const mapDeityTableRowToDeity = async (row: HTMLElementData): Promise<Deity> => {
  const ar_wiki_url = `${WikiUrl}${row.querySelector('a')?.getAttribute('href')}`;
  const [
    name,
    alignment,
    ar_clergy_alignments,
    aspect1,
    aspect2,
    ar_category,
  ] = row.querySelectorAll('td');

  const deity = {
    ar_wiki_url: ar_wiki_url,
    name: name?.textContent.trim(),
    alignment: alignment?.textContent.trim(),
    clergy_alignments: ar_clergy_alignments?.textContent.trim().split(' ').filter(Boolean),
    ar_aspects: [aspect1?.textContent.trim(), aspect2?.textContent.trim()].filter(Boolean),
    ar_clergy_alignments: ar_clergy_alignments?.textContent.trim().split(' ').filter(Boolean),
    ar_category: ar_category?.textContent.trim(),
  };

  return await fetchAndMapDeityPage(deity);
};

const handleAlternativeWorship = async (deityQuery: string): Promise<Deity | undefined> => {
  if (findBestStringMatch(['abeir-toril', 'toril', 'nature', 'beasts'], deityQuery)) {
    const deity = {
      name: 'Abeir-Toril',
      alignment: 'No Alignment',
      ar_wiki_url: `${WikiUrl}/Toril`,
      ar_aspects: ['Nature', 'Magic'],
      thumbnail: 'https://vignette.wikia.nocookie.net/forgottenrealms/images/7/71/Toril-globe-small.jpg',
    };

    return await fetchAndMapDeityPage(deity);
  }
};

export const fetchDeity = async (deityQuery: string): Promise<Deity | undefined> => {
  const dom = await fetchBeautifulDom(DeityTableUrl);
  const tableRow = findBestStringMatch(
    dom.querySelectorAll('tbody tr').filter(r => !r.querySelectorAll('td')[5]?.textContent.trim().toLowerCase().includes('heresies')),
    deityQuery.toLowerCase().replace(/\s+/g, ''),
    r => r.querySelector('a')?.textContent.toLowerCase().replace(/\s+/g, ''),
  );

  if (tableRow) return await mapDeityTableRowToDeity(tableRow);

  return handleAlternativeWorship(deityQuery);
};

export const fetchAllDeities = async (): Promise<Deity[]> => {
  const dom = await fetchBeautifulDom(DeityTableUrl);
  return Promise.all(dom.querySelectorAll('tbody tr').map(mapDeityTableRowToDeity));
};
