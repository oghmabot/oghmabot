import BeautifulDom from "beautiful-dom";
import HTMLElementData from "beautiful-dom/dist/htmlelement";
import fetch from "node-fetch";
import { Deity } from "../../models";

const WikiUrl = 'http://wiki.arelith.com';
const DeityTableUrl = 'http://wiki.arelith.com/Deity_Table';

const fetchBeautifulDom = async (url: string) => new BeautifulDom(await fetch(url).then(response => response.text()));

const getAbstractWorshipFields = (deityName?: string): Partial<Deity> | undefined => {
  if (!deityName) return;

  if (deityName.includes('Abyss')) {
    return {
      ar_abstract: true,
      titles: ['The Abyss'],
      alignment: 'Chaotic Evil',
      clergy_alignments: ['CN', 'CE', 'NE'],
      ar_wiki_href: `/Abyss`,
    };
  }

  if (deityName.includes('Toril')) {
    return {
      ar_abstract: true,
      titles: ['Abeir-Toril'],
      alignment: 'No Alignment',
      clergy_alignments: ['N/A'],
      thumbnail: 'https://vignette.wikia.nocookie.net/forgottenrealms/images/7/71/Toril-globe-small.jpg',
    };
  }
};

const fetchAndMapDeityPage = async (deity: Deity): Promise<Deity> => {
  const dom = await fetchBeautifulDom(`${WikiUrl}${deity.ar_wiki_href}`);
  const dogma = dom.querySelectorAll('h3').find(h => h.querySelector('span')?.getAttribute('id')?.toLowerCase() === 'dogma');
  const [
    ,
    symbol,
    alignment,
    portfolio,
    worshipers,
    domains,
    ar_clergy_alignments,
  ] = dom.querySelectorAll('tbody tr');

  return {
    ...deity,
    titles: dom.querySelector('dl dd i')?.textContent.split(',').map(t => t.trim()),
    symbol: symbol?.querySelectorAll('td')[1]?.textContent.trim(),
    alignment: alignment?.querySelectorAll('td')[1]?.textContent.trim(),
    portfolio: portfolio?.querySelectorAll('td')[1]?.textContent.split(',').map(p => p.trim()),
    worshipers: worshipers?.querySelectorAll('td')[1]?.textContent.split(',').map(p => p.trim()),
    domains: domains?.querySelectorAll('td')[1]?.textContent.replace(/ *\[[^\]]*]/g, '').split(',').map(d => d.trim()),
    ar_clergy_alignments: ar_clergy_alignments?.querySelectorAll('td')[1]?.textContent.split(',').map(a => a.trim()),
  };
};

const mapDeityTableRowToDeity = async (row: HTMLElementData): Promise<Deity> => {
  const url = row.querySelector('a')?.getAttribute('href');
  const [
    name,
    alignment,
    ar_clergy_alignments,
    aspect1,
    aspect2,
    ar_category,
  ] = row.querySelectorAll('td');

  const deity = {
    url: `${WikiUrl}${url}`,
    ar_wiki_href: `${url}`,
    name: name?.textContent.trim(),
    alignment: alignment?.textContent.trim(),
    clergy_alignments: ar_clergy_alignments?.textContent.trim().split(' '),
    ar_aspects: [aspect1?.textContent.trim(), aspect2?.textContent.trim()],
    ar_clergy_alignments: ar_clergy_alignments?.textContent.trim().split(' '),
    ar_category: ar_category?.textContent.trim(),
    ...getAbstractWorshipFields(name?.textContent),
  };

  return deity.ar_abstract
    ? deity
    : await fetchAndMapDeityPage(deity);
};

export const fetchDeity = async (deityQuery: string): Promise<Deity | undefined> => {
  const dom = await fetchBeautifulDom(DeityTableUrl);
  const tableRow = dom.querySelectorAll('tbody tr').find(r =>
    r.querySelector('a')?.textContent.toLowerCase().replace(/\s+/g, '').includes(deityQuery.toLowerCase().replace(/\s+/g, '')),
  );

  if (tableRow) return await mapDeityTableRowToDeity(tableRow);
};

export const fetchAllDeities = async (): Promise<Deity[]> => {
  const dom = await fetchBeautifulDom(DeityTableUrl);
  return Promise.all(dom.querySelectorAll('tbody tr').map(mapDeityTableRowToDeity));
};
